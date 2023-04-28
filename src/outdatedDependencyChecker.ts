import glob from 'glob';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import { table } from 'table';

type DependencyTimestamps = Record<string, string>;

type Dependencies = Record<string, string>;

type Version = string;
// eslint-disable-next-line @typescript-eslint/naming-convention
type ISO_8601 = string;
type DependencyNpmInfo = {
  'dist-tags': {
    latest: Version;
    [tag: Version]: Version;
  };
  versions: Version[];
  time: Record<Version, ISO_8601>;
};

type DependencyInfo = {
  name: string;
  currentVersion: string;
  latestVersion: string;
  daysDifference: number;
};

async function getAllPackageJsonFiles(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob('**/package.json', { ignore: 'node_modules/**' }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

async function normalizeDependencies(): Promise<Dependencies> {
  const packageJsonFiles = await getAllPackageJsonFiles();
  const normalizedDependencies: Dependencies = {};

  for (const file of packageJsonFiles) {
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      dependencies: Dependencies;
      devDependencies: Dependencies;
    };
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const [name, version] of Object.entries(dependencies)) {
      if (!normalizedDependencies[name] || normalizedDependencies[name] !== version) {
        normalizedDependencies[name] = version;
      }
    }
  }

  return normalizedDependencies;
}
function updateLoadingIndicator(current: number, total: number) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${current}/${total} packages fetched`);
}

async function outdatedDependencyChecker(): Promise<void> {
  console.log('Checking for outdated dependencies...');
  console.info('[INFO] Retrieving all package.json files');
  const dependencies = await normalizeDependencies();
  console.info(`Found ${Object.keys(dependencies).length} dependencies`);
  console.info('Fetching NPM info for each dependency');
  const promises: Promise<void>[] = [];
  // New arrays to store dependency information and errors.
  const dependencyInfoList: DependencyInfo[] = [];
  const errorList: string[] = [];

  const howManyDeps = Object.keys(dependencies).length;
  let fetchedPackages = 0;
  const updateLoader = () => {
    fetchedPackages = +1;
    updateLoadingIndicator(fetchedPackages, howManyDeps);
  };

  updateLoadingIndicator(0, howManyDeps);
  for (const [name, currentVersion] of Object.entries(dependencies).slice(0, 10)) {
    // const currentVersion = unformattedCurrentVersion.replace('^', '');
    console.log('currentVersion', currentVersion);
    if (currentVersion.includes('workspace')) {
      updateLoader();
      // eslint-disable-next-line no-continue
      continue;
    }

    const command = `yarn npm info ${name} --json`;
    const promise = new Promise<void>((resolve) => {
      exec(command, (error: Error | null, stdout: string, stderr: string) => {
        updateLoader();
        if (error || stderr) {
          const errorMessage = error ? error.message : stderr;
          errorList.push(`${name}: ${errorMessage}`);
          resolve();
          return;
        }

        const depInfo = JSON.parse(stdout) as DependencyNpmInfo;
        const versionsTimestamps: DependencyTimestamps = depInfo.time;
        const latestVersion = depInfo.versions.pop();
        if (latestVersion && currentVersion && latestVersion !== currentVersion) {
          const latestTimestamp = new Date(versionsTimestamps[latestVersion]);
          const currentTimestamp = new Date(versionsTimestamps[currentVersion.replace('^', '')]);
          const daysDifference = Math.floor(
            (latestTimestamp.getTime() - currentTimestamp.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (Number.isNaN(daysDifference)) {
            console.info(
              `${name} had an issue when calculating how old the current package we are using is'There is '.`,
              { versionsTimestamps, currentVersion, latestVersion },
            );
          }

          dependencyInfoList.push({
            name,
            currentVersion,
            latestVersion,
            daysDifference,
          });
        }

        resolve();
      });
    });

    promises.push(promise);
  }

  try {
    await Promise.all(promises);
  } catch (e) {
    console.log('Failed resolving a dependency', e);
  }

  console.log('Done fetching');

  const tableData = [
    ['Module', 'Current Version', 'Latest Version', 'Days Since Current Version Published'],
    ...dependencyInfoList.map((info) => [
      info.name,
      info.currentVersion,
      info.latestVersion,
      info.daysDifference,
    ]),
  ];
  // @eslint-disable-next-line
  console.log(table(tableData));
}

void outdatedDependencyChecker();
