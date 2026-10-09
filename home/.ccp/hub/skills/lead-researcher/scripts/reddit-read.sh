#!/usr/bin/env bash
# reddit-read.sh URL... : read Reddit threads or subreddit searches through the owner's
# logged-in browser (bsk), one session, serially. Read only. Prints compact text per URL.
# Thread URL  -> title, score, post body, top comments.
# Search URL (/r/<sub>/search.json?q=..&restrict_sr=1) -> title, score, comments, permalink per hit.
set -euo pipefail
[ $# -gt 0 ] || { echo "usage: reddit-read.sh URL..." >&2; exit 2; }
S=$(bsk session start --no-focus 2>/dev/null | tail -1)
trap 'bsk session stop "$S" >/dev/null 2>&1 || true' EXIT
tmp=$(mktemp -d); trap 'bsk session stop "$S" >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
i=0
for u in "$@"; do
  i=$((i+1))
  j=$(printf '%s' "$u" | sed -E 's#https?://(www\.)?reddit\.com#https://old.reddit.com#')
  case "$j" in *.json*) ;; *) j="${j%/}/.json?limit=50";; esac
  echo "===== $u"
  if bsk navigate "$j" --session "$S" >/dev/null 2>&1 && bsk get-html --session "$S" >"$tmp/$i.html" 2>/dev/null; then
    python3 -I - "$tmp/$i.html" <<'PY' || echo "(could not parse: login wall, removed, or not JSON)"
import sys,re,json,html
t=html.unescape(re.sub(r'<[^>]+>','',open(sys.argv[1]).read()))
m=re.search(r'(\[\{"kind".*\]|\{"kind".*\})',t,re.S); d=json.loads(m.group(1))
def cut(s,n): s=' '.join((s or '').split()); return s[:n]+('…' if len(s)>n else '')
if isinstance(d,dict):   # search listing
  for c in d['data']['children']:
    p=c['data']; print(f"- [{p['score']}↑ {p['num_comments']}c] {p['title']} https://old.reddit.com{p['permalink']}")
else:                    # thread
  p=d[0]['data']['children'][0]['data']
  print(f"TITLE: {p['title']} | {p['score']}↑ | {p['num_comments']} comments | r/{p['subreddit']}")
  print('POST:',cut(p.get('selftext'),3000))
  def walk(cs,depth):
    for c in cs:
      if c['kind']!='t1': continue
      b=c['data']
      if b.get('body') not in ('[removed]','[deleted]'):
        print('  '*depth+f"- [{b.get('score')}↑ u/{b.get('author')}] {cut(b.get('body'),1500)}")
      r=b.get('replies')
      if depth<2 and isinstance(r,dict): walk(r['data']['children'],depth+1)
  walk(d[1]['data']['children'],0)
PY
  else echo "(browser fetch failed)"; fi
done
