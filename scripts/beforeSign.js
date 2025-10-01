const { execSync } = require("child_process");
const path = require("path");

exports.default = async function (context) {
  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  );
  console.log("🔍 Cleaning extended attributes in:", appPath);

  try {
    // List all extended attributes recursively
    const result = execSync(`xattr -rl "${appPath}" || true`).toString();
    const badAttrs = [
      "com.apple.FinderInfo",
      "com.apple.ResourceFork",
      "com.apple.quarantine",
      "com.apple.provenance",
      "com.apple.fileprovider.fpfs#P",
    ];

    if (!result.trim()) {
      console.log("✅ No extended attributes found.");
      return;
    }

    const lines = result.split("\n").filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const bad of badAttrs) {
        if (line.includes(bad)) {
          const [filePath] = line.split(": ");
          try {
            execSync(`xattr -d "${bad}" "${filePath}"`);
            console.log(`   🔧 Removed ${bad} from ${filePath}`);
          } catch (e) {
            console.warn(
              `   ⚠️ Could not remove ${bad} from ${filePath}: ${e.message}`
            );
          }
        }
      }
    }

    // Run one more sweep in case macOS re-applied attributes
    const leftovers = execSync(`xattr -rl "${appPath}" || true`).toString();
    if (leftovers.trim().length === 0) {
      console.log("✅ All unwanted extended attributes cleaned.");
    } else {
      console.log("⚠️ Remaining attributes (likely safe signing ones):\n", leftovers);
    }
  } catch (e) {
    console.error("❌ Error cleaning extended attributes", e);
    throw e;
  }
};
