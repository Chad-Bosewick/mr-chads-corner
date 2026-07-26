const { spawnSync } = require("node:child_process");
const path = require("node:path");

const command = process.argv[2] || "build";
const args = process.argv.slice(3);

const nextBin = require.resolve("next/dist/bin/next");
const fontMocksPath = path.join(process.cwd(), "scripts/google-font-mocks.cjs");

const result = spawnSync(process.execPath, [nextBin, command, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_FONT_GOOGLE_MOCKED_RESPONSES: fontMocksPath,
  },
});

process.exit(result.status ?? 1);
