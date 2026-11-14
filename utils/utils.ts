import fs from 'fs';
import path from 'path';

export function getProjectRoot(): string {
   let currentDir = process.cwd(); // Starts at your package's directory
   while (currentDir !== path.parse(currentDir).root) {
      if (fs.existsSync(path.join(currentDir, 'package.json'))) {
         return currentDir;
      }
      currentDir = path.dirname(currentDir); // Move up
   }
   throw new Error('This is not a npm project');
}

export type CaseFormat = 'camel' | 'pascal' | 'snake' | 'kebab';

export function convertCase(str: string, format: CaseFormat = 'camel'): string {
   if (!str) return '';

   const words = str
      .replace(/[-_\s]+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0);

   if (words.length === 0) return '';

   let processedWords: string[];
   let separator = '';

   switch (format) {
      case 'camel':
         processedWords = words.map((word, index) =>
            index === 0
               ? word.toLowerCase()
               : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
         );
         separator = '';
         break;
      case 'pascal':
         processedWords = words.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
         );
         separator = '';
         break;
      case 'snake':
         processedWords = words.map(word => word.toLowerCase());
         separator = '_';
         break;
      case 'kebab':
         processedWords = words.map(word => word.toLowerCase());
         separator = '-';
         break;
   }

   return processedWords.join(separator);
}

export type GeneratedFile = [filePath: string, content: string];

export interface WriteOptions {
   force?: boolean;
   dryRun?: boolean;
}

export function writeFiles(files: GeneratedFile[], { force = false, dryRun = false }: WriteOptions = {}): boolean {
   const conflicts = files.filter(([filePath]) => fs.existsSync(filePath)).map(([filePath]) => filePath);
   if (conflicts.length > 0 && !force) {
      conflicts.forEach((filePath) => console.error(`File already exists: ${filePath}`));
      console.error('Refusing to overwrite existing files. Use --force to overwrite them.');
      process.exitCode = 1;
      return false;
   }
   if (dryRun) {
      files.forEach(([filePath]) => console.log(`[dry-run] Would write ${filePath}`));
      return true;
   }
   files.forEach(([filePath, content]) => {
      fs.writeFileSync(filePath, content);
      console.log(`Created ${filePath}`);
   });
   return true;
}
