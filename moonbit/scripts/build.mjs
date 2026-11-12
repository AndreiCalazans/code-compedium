import { spawnSync } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = ["build", "--target", "js", "--release", "browser"];
let build = spawnSync("moon", args, { cwd: root, stdio: "inherit" });
if (build.error?.code === "ENOENT") {
  // The official installer uses ~/.moon, but this shell may not have it on PATH.
  const bin = join(process.env.MOON_HOME || join(homedir(), ".moon"), "bin");
  const executable = join(bin, process.platform === "win32" ? "moon.exe" : "moon");
  build = spawnSync(executable, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, PATH: `${bin}${delimiter}${process.env.PATH ?? ""}` },
  });
}
if (build.error) {
  console.error("Cannot run moon. Install the MoonBit toolchain in ~/.moon or add it to PATH.");
  console.error("Setup: https://docs.moonbitlang.com/en/latest/tutorial/tour.html#installation");
  process.exit(1);
}
if (build.status !== 0) process.exit(build.status ?? 1);

await mkdir(new URL("../web/generated/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../_build/js/release/build/browser/browser.js", import.meta.url),
  new URL("../web/generated/game.mjs", import.meta.url),
);
console.log("Built MoonBit game rules → web/generated/game.mjs");
