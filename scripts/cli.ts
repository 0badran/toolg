#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import ora from 'ora';
import { getProjectRoot } from '../utils/utils.js';
import { buildDeps, planJestFiles, writeJestFiles, addTestScript, type InitAnswers } from './testing_setup.js';

const force = process.argv.includes('--force');

inquirer
   .prompt<InitAnswers>([
      {
         type: 'confirm',
         name: 'nextjs',
         message: 'Are you using Next.js?',
      },
      {
         type: 'confirm',
         name: 'typescript',
         message: 'Are you using TypeScript?',
      }
   ])
   .then((answers) => {
      const root = getProjectRoot();

      // Preflight: refuse before installing anything if setup files would be overwritten.
      if (!force) {
         const conflicts = planJestFiles(root, answers).filter(([filePath]) => fs.existsSync(filePath)).map(([filePath]) => filePath);
         if (conflicts.length > 0) {
            conflicts.forEach((filePath) => console.error(`File already exists: ${filePath}`));
            console.error('Refusing to overwrite existing files. Use --force to overwrite them.');
            process.exit(1);
         }
      }

      const command = `npm i -D ${buildDeps(answers).join(' ')}`;

      // Create a spinner
      const spinner = ora('Installing dependencies...').start();

      exec(command, { cwd: root }, (error) => {
         if (error) {
            spinner.fail(`Installation failed: ${error.message}`);
            process.exit(1);
         }

         if (!writeJestFiles(root, answers, { force })) {
            spinner.fail('Jest setup files were not written.');
            process.exit(1);
         }
         addTestScript(root);

         const configPath = path.join(root, 'toolg.config.json');
         if (fs.existsSync(configPath) && !force) {
            console.warn('toolg.config.json already exists - keeping it (use --force to overwrite).');
         } else {
            fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
         }

         spinner.succeed('Dependencies installed successfully.');
      });
   });
