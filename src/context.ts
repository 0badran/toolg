import fs from 'fs';
import { getProjectRoot } from '../utils/utils.js';

export interface ToolgConfig {
   nextjs: boolean;
   typescript: boolean;
}

export interface GenOptions {
   force: boolean;
   dryRun: boolean;
}

export interface CliOptions {
   service?: string;
   force?: boolean;
   dryRun?: boolean;
}

export let rootPath = '';
export let targetPath = '';
export let config: ToolgConfig;
export let fileType: 'ts' | 'js' = 'js';
export let genOpts: GenOptions = { force: false, dryRun: false };

export function initContext(opts: CliOptions): void {
   if (!fs.existsSync('toolg.config.json')) {
      console.error('Config file not found:');
      console.warn('Run `npx toolg-init` to create a config file');
      process.exit(1);
   }

   rootPath = getProjectRoot();
   const rootFiles = fs.readdirSync(rootPath);
   const hasAppFolder = rootFiles.includes('app');
   targetPath = `${rootPath}/${hasAppFolder ? 'app' : 'src'}`;
   config = JSON.parse(fs.readFileSync('toolg.config.json', 'utf-8')) as ToolgConfig;
   fileType = config.typescript ? 'ts' : 'js';
   genOpts = { force: !!opts.force, dryRun: !!opts.dryRun };

   if (!genOpts.dryRun) {
      fs.mkdirSync(`${targetPath}/${opts.service ? 'services' : 'components'}`, { recursive: true });
   }
}
