#!/usr/bin/env node
/**
 * Yarn 4.1.0 (Berry) only: find packages that exist at multiple versions in yarn.lock
 *
 * Usage:
 *   node yarn4-find-duplicate-versions.mjs [path/to/yarn.lock] [--json]
 *
 * Output:
 *   - Human-readable list by default
 *   - JSON when --json is passed
 *
 * Notes:
 *   - Assumes Yarn 4.x lockfile format (YAML-like).
 *   - Handles multiple selectors per entry:
 *       "@scope/pkg@npm:^1.2.3", "@scope/pkg@npm:~1.3.0":
 *         version: 1.3.2
 *   - Derives package name by trimming everything after the LAST '@'
 *     (so "@scope/pkg@npm:^1.2.3" -> "@scope/pkg").
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const showJson = args.includes('--json');
const fileArg = args.find(a => a !== '--json');
const lockPath = path.resolve(process.cwd(), fileArg || 'yarn.lock');

if (!fs.existsSync(lockPath)) {
  console.error(`Error: yarn.lock not found at ${lockPath}`);
  process.exit(1);
}

const text = fs.readFileSync(lockPath, 'utf8');
const lines = text.split(/\r?\n/);

// A header line is a top-level selector list ending with ":"
const isHeader = line => !/^\s/.test(line) && /:\s*$/.test(line);

// Split the header into individual selectors and strip quotes
function parseSelectors(headerLine) {
  const head = headerLine.replace(/:\s*$/, '');
  return head.split(/,\s*/).map(s => {
    s = s.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.slice(1, -1);
    }
    return s;
  }).filter(Boolean);
}

// Get bare package name from a Yarn 4 selector (use last '@')
function pkgNameFromSelector(selector) {
  const at = selector.lastIndexOf('@');
  return at > 0 ? selector.slice(0, at) : selector;
}

// State while scanning
let currentSelectors = null;
let currentVersion = null;

// name -> Map<version, Set<selectors>>
const index = new Map();

function commit() {
  if (!currentSelectors || !currentVersion) return;
  for (const sel of currentSelectors) {
    const name = pkgNameFromSelector(sel);
    if (!index.has(name)) index.set(name, new Map());
    const byVer = index.get(name);
    if (!byVer.has(currentVersion)) byVer.set(currentVersion, new Set());
    byVer.get(currentVersion).add(sel);
  }
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (isHeader(line)) {
    commit();
    currentSelectors = parseSelectors(line);
    currentVersion = null;
    continue;
  }

  if (currentSelectors) {
    // Berry style: "version: 1.2.3" or 'version: "1.2.3"'
    const m = line.match(/^\s*version:\s*("?)([^"\s].*?)\1\s*$/);
    if (m) {
      currentVersion = m[2].trim();
    }
  }
}
commit();

// Build duplicate list
const duplicates = [];
for (const [name, byVer] of index.entries()) {
  if (byVer.size > 1) {
    duplicates.push({
      name,
      versions: Array.from(byVer.keys()).sort(),
      selectorsByVersion: Object.fromEntries(
        Array.from(byVer.entries()).map(([v, sels]) => [v, Array.from(sels).sort()])
      ),
      count: byVer.size
    });
  }
}

// Output
duplicates.sort((a, b) => a.name.localeCompare(b.name));

if (showJson) {
  console.log(JSON.stringify(duplicates, null, 2));
  process.exit(duplicates.length ? 2 : 0);
}

if (duplicates.length === 0) {
  console.log('No duplicates found 🎉');
  process.exit(0);
}

console.log(`Found ${duplicates.length} packages with multiple versions:\n`);
for (const d of duplicates) {
  console.log(`${d.name} (${d.count})`);
  for (const v of d.versions) {
    console.log(`  - ${v}`);
    const sels = d.selectorsByVersion[v];
    // Show a couple of selectors to indicate what ranges resolved to this version
    for (const s of sels.slice(0, 3)) {
      console.log(`      • ${s}`);
    }
    if (sels.length > 3) console.log(`      … ${sels.length - 3} more`);
  }
  console.log();
}
// Non-zero exit to help CI fail when duplicates exist
process.exit(2);
