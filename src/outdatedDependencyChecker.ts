import fs from 'fs';
import { exec } from 'child_process';
import packageJson from './package.json';

interface DependencyTimestamps {
  [version: string]: string;
}

const outdatedDependencyChecker = async (): Promise<void> => {
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  for (const [name, currentVersion] of Object.entries(dependencies)) {
    const command = `npm view ${name} time --json`;

    exec(command, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }

      const versionsTimestamps: DependencyTimestamps = JSON.parse(stdout);
      const latestVersion = Object.keys(versionsTimestamps).pop();

      if (latestVersion !== currentVersion) {
        const latestTimestamp = new Date(versionsTimestamps[latestVersion]);
        const currentTimestamp = new Date(versionsTimestamps[currentVersion]);
        const daysDifference = Math.floor((latestTimestamp.getTime() - currentTimestamp.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`${name}:`);
        console.log(`\tLatest version: ${latestVersion}`);
        console.log(`\tCurrent version: ${currentVersion}`);
        console.log(`\tAge of the current version: ${daysDifference} days`);
      }
    });
  }
};

outdatedDependencyChecker();
