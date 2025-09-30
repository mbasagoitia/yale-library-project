const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`🚀 Notarizing ${appName}...`);

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`📡 Notarization attempt ${attempt} of ${maxRetries}...`);

      await notarize({
        appBundleId: 'com.yale.demoapp',
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
        teamId: process.env.APPLE_TEAM_ID,
        keychain: 'build.keychain', // explicitly specify keychain
      });

      console.log('✅ Notarization successful!');
      return; // exit once successful
    } catch (error) {
      console.error(`❌ Notarization attempt ${attempt} failed: ${error.message}`);

      // Detect transient network errors
      if (
        error.message.includes('NSURLErrorDomain Code=-1009') || // offline
        error.message.includes('timed out') ||                   // timeout
        error.message.includes('network')                        // generic network
      ) {
        if (attempt < maxRetries) {
          console.log('🔁 Retrying notarization in 30 seconds...');
          await new Promise(res => setTimeout(res, 30000)); // wait before retry
          continue;
        }
      }

      // If it's not a transient error, or we ran out of retries → fail hard
      throw error;
    }
  }
};
