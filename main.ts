#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import { convertCase } from './utils/utils.js';
import { initContext } from './src/context.js';
import { createCRUD, createService, deleteService, getService, updateService } from './src/create_service.js';
import generateComponent from './src/create_component.js';

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

program
   .name('toolg, tool-generator')
   .version(packageJson.version, '-v, --version', 'Display the version of the tool') // Properly defining version
   .argument('<name>', 'The name for tools to generate')
   .description('Create a component by default or a service with the -s flag')
   .helpOption('-h, --help', 'Display help for command')
   .option('-s, --service <char>', 'Create a service like(delete, update, create, read, all) services')
   .description('-s <service> [c|r|u|d|a]')
   .option('-f, --force', 'Overwrite existing generated files')
   .option('--dry-run', 'Show the files that would be generated without writing them')
   .parse();

const args = program.args;
const opts = program.opts<{ service?: string; force?: boolean; dryRun?: boolean }>();
const tmp = args[0];

initContext(opts);

if (opts.service) {
   const name = convertCase(tmp);
   const service = opts.service;
   switch (service) {
      case 'c':
         createService(name);
         break;
      case 'r':
         getService(name);
         break;
      case 'u':
         updateService(name);
         break;
      case 'd':
         deleteService(name);
         break;
      case 'a':
         createCRUD(name);
         break;
      default:
         console.error('Invalid service option:', service);
         console.warn('Use c, r, u, d, or a instead');
   }
} else {
   const name = convertCase(tmp, 'pascal');
   generateComponent(name);
}
