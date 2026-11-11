#!/usr/bin/env node
// Render a seekable HTML page to a video, one frame at a time.
//
// The page must define window.__seek(tSeconds): set every visual value for that
// time, synchronously, with no wall-clock animation. The script steps a headless
// Chrome through each frame over the DevTools protocol, takes a screenshot, and
// pipes the PNGs to ffmpeg. No npm dependencies: Node 22+ and Chrome only.
//
// Usage:
//   render_html.mjs PAGE.html OUT.mp4 --seconds S [--fps 30] [--width 1920]
//                   [--height 1080] [--audio mix.wav] [--still T OUT.png]
//
// Environment: CHROME_PATH overrides the browser binary.

import {spawn} from 'node:child_process';
import {existsSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

function fail(message) {
  console.error(`render_html: ${message}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = {fps: 30, width: 1920, height: 1080, seconds: null, audio: null, still: null};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      console.log(
        'Usage: render_html.mjs PAGE.html OUT.mp4 --seconds S [--fps 30] [--width 1920] [--height 1080] [--audio mix.wav]\n' +
          '       render_html.mjs PAGE.html --still T OUT.png [--width 1920] [--height 1080]\n' +
          'The page must define window.__seek(tSeconds).',
      );
      process.exit(0);
    } else if (a === '--still') {
      opts.still = {t: Number(argv[++i]), out: argv[++i]};
    } else if (a === '--audio') {
      opts.audio = argv[++i];
    } else if (['--fps', '--width', '--height', '--seconds'].includes(a)) {
      opts[a.slice(2)] = Number(argv[++i]);
    } else if (a.startsWith('--')) {
      fail(`unknown option ${a}`);
    } else {
      rest.push(a);
    }
  }
  opts.page = rest[0];
  opts.out = rest[1];
  if (!opts.page || !existsSync(opts.page)) fail(`page not found: ${opts.page}`);
  if (opts.still) {
    if (!Number.isFinite(opts.still.t) || !opts.still.out) fail('--still needs a time and an output path');
  } else {
    if (!opts.out) fail('missing OUT.mp4');
    if (!(opts.seconds > 0)) fail('--seconds must be a positive number');
  }
  for (const k of ['fps', 'width', 'height']) if (!(opts[k] > 0)) fail(`--${k} must be positive`);
  if (opts.audio && !existsSync(opts.audio)) fail(`audio not found: ${opts.audio}`);
  return opts;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) fail('no Chrome or Chromium found; set CHROME_PATH');
  return found;
}

function launchChrome(profileDir, width, height) {
  const chrome = spawn(
    findChrome(),
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`,
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--force-color-profile=srgb',
      '--allow-file-access-from-files',
      '--autoplay-policy=no-user-gesture-required',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    {stdio: ['ignore', 'ignore', 'pipe']},
  );
  const ready = new Promise((ok, bad) => {
    let buf = '';
    const timer = setTimeout(() => bad(new Error('Chrome did not start in 30 s')), 30000);
    chrome.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        ok(m[1]);
      }
    });
    chrome.on('exit', (code) => bad(new Error(`Chrome exited early (code ${code})`)));
  });
  return {chrome, ready};
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const {ok, bad} = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) bad(new Error(`${msg.error.message}`));
        else ok(msg.result);
      } else if (msg.method) {
        for (const l of this.listeners) l(msg);
      }
    });
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((ok, bad) => {
      ws.addEventListener('open', ok, {once: true});
      ws.addEventListener('error', () => bad(new Error('cannot connect to Chrome')), {once: true});
    });
    return new Cdp(ws);
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({id, method, params, sessionId}));
    return new Promise((ok, bad) => this.pending.set(id, {ok, bad}));
  }
  waitFor(method, sessionId, ms = 30000) {
    return new Promise((ok, bad) => {
      const timer = setTimeout(() => bad(new Error(`timed out waiting for ${method}`)), ms);
      const l = (msg) => {
        if (msg.method === method && msg.sessionId === sessionId) {
          clearTimeout(timer);
          this.listeners.splice(this.listeners.indexOf(l), 1);
          ok(msg.params);
        }
      };
      this.listeners.push(l);
    });
  }
}

async function evaluate(cdp, sessionId, expression) {
  const r = await cdp.send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true}, sessionId);
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error(`page error: ${d.exception?.description ?? d.text}`);
  }
  return r.result.value;
}

// Seek, then wait for two animation frames so layout and paint are done before capture.
const seekExpr = (t) =>
  `(async () => { await window.__seek(${t}); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); })()`;

// A frame that takes this long means Chrome or the page is stuck. Fail instead of waiting forever.
const FRAME_TIMEOUT_MS = 60000;

async function capture(cdp, sessionId, t) {
  let timer;
  const stuck = new Promise((_, bad) => {
    timer = setTimeout(() => bad(new Error(`frame at t=${t}s did not finish in ${FRAME_TIMEOUT_MS / 1000} s; Chrome or the page is stuck`)), FRAME_TIMEOUT_MS);
  });
  const work = (async () => {
    await evaluate(cdp, sessionId, seekExpr(t));
    const shot = await cdp.send('Page.captureScreenshot', {format: 'png', optimizeForSpeed: true}, sessionId);
    return Buffer.from(shot.data, 'base64');
  })();
  try {
    return await Promise.race([work, stuck]);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const profileDir = mkdtempSync(join(tmpdir(), 'render-html-'));
  const {chrome, ready} = launchChrome(profileDir, opts.width, opts.height);
  let exitCode = 0;
  try {
    const cdp = await Cdp.connect(await ready);
    const {targetId} = await cdp.send('Target.createTarget', {url: 'about:blank'});
    const {sessionId} = await cdp.send('Target.attachToTarget', {targetId, flatten: true});
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      {width: opts.width, height: opts.height, deviceScaleFactor: 1, mobile: false},
      sessionId,
    );
    const pageErrors = [];
    cdp.listeners.push((msg) => {
      if (msg.sessionId === sessionId && msg.method === 'Runtime.exceptionThrown') {
        pageErrors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
      }
    });
    const loaded = cdp.waitFor('Page.loadEventFired', sessionId);
    await cdp.send('Page.navigate', {url: pathToFileURL(resolve(opts.page)).href}, sessionId);
    await loaded;
    await evaluate(cdp, sessionId, 'document.fonts.ready.then(() => true)');
    const hasSeek = await evaluate(cdp, sessionId, 'typeof window.__seek === "function"');
    if (!hasSeek) throw new Error('the page does not define window.__seek(tSeconds)');

    if (opts.still) {
      writeFileSync(opts.still.out, await capture(cdp, sessionId, opts.still.t));
      console.log(`wrote ${opts.still.out} at t=${opts.still.t}s`);
    } else {
      const total = Math.round(opts.seconds * opts.fps);
      const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(opts.fps), '-c:v', 'png', '-i', '-'];
      if (opts.audio) args.push('-i', opts.audio);
      args.push(
        '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
        '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-movflags', '+faststart',
      );
      if (opts.audio) args.push('-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest');
      args.push(opts.out);
      const ff = spawn('ffmpeg', args, {stdio: ['pipe', 'inherit', 'inherit']});
      const ffDone = new Promise((ok, bad) => {
        ff.on('error', (e) => bad(new Error(`cannot run ffmpeg: ${e.message}`)));
        ff.on('exit', (code) => (code === 0 ? ok() : bad(new Error(`ffmpeg failed (code ${code})`))));
      });
      ff.stdin.on('error', () => {}); // the exit handler reports the real failure
      for (let f = 0; f < total; f++) {
        const png = await capture(cdp, sessionId, f / opts.fps);
        if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
        if (f % opts.fps === 0) process.stderr.write(`\rframe ${f}/${total}`);
      }
      ff.stdin.end();
      await ffDone;
      process.stderr.write(`\rframe ${total}/${total}\n`);
      console.log(`wrote ${opts.out}: ${total} frames, ${opts.fps} fps, ${opts.width}x${opts.height}`);
    }
    if (pageErrors.length) {
      console.error(`render_html: the page threw ${pageErrors.length} error(s):\n  ${pageErrors.slice(0, 5).join('\n  ')}`);
      exitCode = 1;
    }
  } catch (e) {
    console.error(`render_html: ${e.message}`);
    exitCode = 2;
  } finally {
    chrome.kill();
    await new Promise((r) => setTimeout(r, 300));
    rmSync(profileDir, {recursive: true, force: true});
  }
  process.exit(exitCode);
}

main();
