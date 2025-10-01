const { execSync } = require("child_process");
const path = require("path");

module.exports = async function(context) {
  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  );

  console.log("🧹 Starting extended attributes cleaning:", appPath);

  const badAttrs = [
    "com.apple.FinderInfo",
    "com.apple.ResourceFork",
    "com.apple.quarantine",
    "com.apple.provenance",
    "com.apple.fileprovider.fpfs#P",
    "com.apple.cs.CodeDirectory",
    "com.apple.cs.CodeRequirements",
    "com.apple.cs.CodeSignature"
  ];

  try {
    // Recursive loop until no attributes remain
    let cleanedAny;
    do {
      cleanedAny = false;

      const result = execSync(`xattr -rl "${appPath}" || true`).toString();
      if (!result.trim()) break;

      const lines = result.split("\n").filter(Boolean);

      lines.forEach(line => {
        const split = line.split(": ");
        if (split.length < 2) return;

        const filePath = split[0];
        const attrName = split[1].trim();

        badAttrs.forEach(badAttr => {
          if (attrName === badAttr) {
            try {
              execSync(`xattr -d "${badAttr}" "${filePath}"`);
              console.log(`   🔧 Removed ${badAttr} from ${filePath}`);
              cleanedAny = true;
            } catch (err) {
              console.warn(
                `   ⚠️ Could not remove ${badAttr} from ${filePath}: ${err.message}`
              );
            }
          }
        });
      });
    } while (cleanedAny);

    // Final sweep — log leftovers
    const leftovers = execSync(`xattr -rl "${appPath}" || true`).toString();
    if (!leftovers.trim()) {
      console.log("✅ All unwanted extended attributes cleaned.");
    } else {
      console.log("⚠️ Remaining attributes (likely safe):\n", leftovers);
    }

    console.log("🛠 Running beforeSign logic...");

    // === Your beforeSign.js logic ===
    try {
      execSync(`codesign --force --verify --deep --sign "${context.packager.config.mac.identity}" "${appPath}"`, { stdio: "inherit" });
      console.log("✅ App signed successfully after cleaning.");
    } catch (signErr) {
      console.error("❌ Signing failed:", signErr);
      throw signErr;
    }

  } catch (err) {
    console.error("❌ Error cleaning extended attributes:", err);
    throw err;
  }
};
