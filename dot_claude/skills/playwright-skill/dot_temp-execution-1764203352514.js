const { chromium } = require('playwright');
const fs = require('fs');

// WordPress login credentials
const WP_URL = 'https://vietanlaw.com';
const USERNAME = 'trang.val';
const PASSWORD = 'Trd@vaLawc0m';

(async () => {
  console.log('🚀 Starting WordPress login with nonce extraction...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to WordPress login page
    console.log('📍 Navigating to WordPress login...');
    await page.goto(`${WP_URL}/wp-login.php`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Fill in credentials
    console.log('✍️ Entering credentials...');
    await page.fill('#user_login', USERNAME);
    await page.fill('#user_pass', PASSWORD);

    // Click login button
    console.log('🔐 Clicking login button...');
    await page.click('#wp-submit');

    // Wait for admin dashboard
    await page.waitForURL('**/wp-admin/**', { timeout: 30000 });
    console.log('✅ Login successful! Redirected to:', page.url());

    // Get all cookies
    const cookies = await context.cookies();
    const wpCookies = cookies.filter(c =>
      c.name.includes('wordpress') ||
      c.name.includes('wp-')
    );

    console.log('\n🍪 WordPress Cookies obtained:', wpCookies.length);

    // Navigate to a page that has wpApiSettings
    console.log('\n🔍 Extracting REST API nonce...');
    await page.goto(`${WP_URL}/wp-admin/edit.php`, { waitUntil: 'networkidle' });

    // Extract nonce from wpApiSettings
    const apiSettings = await page.evaluate(() => {
      if (typeof wpApiSettings !== 'undefined') {
        return {
          nonce: wpApiSettings.nonce,
          root: wpApiSettings.root
        };
      }
      return null;
    });

    if (apiSettings && apiSettings.nonce) {
      console.log('✅ Got REST API nonce:', apiSettings.nonce);
      console.log('📍 REST root:', apiSettings.root);

      // Now test REST API with nonce header
      console.log('\n🧪 Testing REST API with X-WP-Nonce header...');

      const response = await page.request.get(`${WP_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          'X-WP-Nonce': apiSettings.nonce
        }
      });

      if (response.ok()) {
        const userData = await response.json();
        console.log('✅ REST API authentication successful!');
        console.log('👤 User:', userData.name);
        console.log('🔰 Roles:', userData.roles?.join(', '));
        console.log('📧 Slug:', userData.slug);

        // Test creating a draft post
        console.log('\n📝 Testing post creation...');
        const postResponse = await page.request.post(`${WP_URL}/wp-json/wp/v2/posts`, {
          headers: {
            'X-WP-Nonce': apiSettings.nonce,
            'Content-Type': 'application/json'
          },
          data: {
            title: 'Test Post from Playwright - ' + new Date().toISOString(),
            content: '<p>This is a test post created via REST API using Playwright cookie authentication.</p>',
            status: 'draft'
          }
        });

        if (postResponse.ok()) {
          const postData = await postResponse.json();
          console.log('✅ Post created successfully!');
          console.log('📄 Post ID:', postData.id);
          console.log('🔗 Edit Link:', postData.link);

          // Delete the test post
          console.log('\n🗑️ Deleting test post...');
          const deleteResponse = await page.request.delete(
            `${WP_URL}/wp-json/wp/v2/posts/${postData.id}?force=true`,
            {
              headers: { 'X-WP-Nonce': apiSettings.nonce }
            }
          );
          if (deleteResponse.ok()) {
            console.log('✅ Test post deleted');
          }
        } else {
          console.log('❌ Post creation failed:', postResponse.status());
          const body = await postResponse.text();
          console.log('Response:', body.substring(0, 500));
        }

        // Save auth data for use in our app
        const authData = {
          cookies: wpCookies,
          nonce: apiSettings.nonce,
          cookieString: wpCookies.map(c => `${c.name}=${c.value}`).join('; '),
          expiresAt: Math.min(...wpCookies.map(c => c.expires || Infinity))
        };

        fs.writeFileSync('/tmp/wp-auth.json', JSON.stringify(authData, null, 2));
        console.log('\n💾 Auth data saved to /tmp/wp-auth.json');

      } else {
        console.log('❌ REST API with nonce failed:', response.status());
        const body = await response.text();
        console.log('Response:', body);
      }
    } else {
      console.log('❌ Could not extract wpApiSettings nonce');

      // Try to find nonce in page source
      const pageContent = await page.content();
      const nonceMatch = pageContent.match(/wpApiSettings[^}]*"nonce"\s*:\s*"([^"]+)"/);
      if (nonceMatch) {
        console.log('Found nonce in page source:', nonceMatch[1]);
      }
    }

    console.log('\n⏳ Browser will close in 3 seconds...');
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/tmp/wp-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('🏁 Done!');
  }
})();
