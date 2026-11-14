import fs from 'fs';
import path from 'path';
import { writeFiles, type GeneratedFile, type WriteOptions } from '../utils/utils.js';

export interface InitAnswers {
   nextjs: boolean;
   typescript: boolean;
}

export function buildDeps(answers: InitAnswers): string[] {
   const deps = ['jest', 'jest-environment-jsdom', '@testing-library/react', '@testing-library/dom', '@testing-library/jest-dom'];
   if (!answers.nextjs) {
      // Next.js compiles via next/jest; other projects need Babel for JSX/TSX.
      deps.push('babel-jest', '@babel/core', '@babel/preset-env', '@babel/preset-react');
   }
   if (answers.typescript) {
      deps.push('@types/react', '@types/react-dom', '@types/jest');
      if (!answers.nextjs) {
         deps.push('@babel/preset-typescript');
      }
   }
   return deps;
}

export function planJestFiles(root: string, answers: InitAnswers): GeneratedFile[] {
   const setupFile = answers.typescript ? 'jest.setup.ts' : 'jest.setup.js';
   const files: GeneratedFile[] = [[path.join(root, setupFile), `import '@testing-library/jest-dom';\n`]];

   if (answers.nextjs) {
      files.push([path.join(root, 'jest.config.mjs'), `import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
   testEnvironment: 'jest-environment-jsdom',
   setupFilesAfterEach: ['<rootDir>/${setupFile}'],
};

export default createJestConfig(config);
`]);
   } else {
      const presets = [
         `['@babel/preset-env', { targets: { node: 'current' } }]`,
         `['@babel/preset-react', { runtime: 'automatic' }]`,
      ];
      if (answers.typescript) {
         presets.push(`'@babel/preset-typescript'`);
      }
      files.push([path.join(root, 'babel.config.cjs'), `module.exports = {
   presets: [
      ${presets.join(',\n      ')},
   ],
};
`]);
      files.push([path.join(root, 'jest.config.cjs'), `module.exports = {
   testEnvironment: 'jest-environment-jsdom',
   setupFilesAfterEach: ['<rootDir>/${setupFile}'],
};
`]);
   }

   return files;
}

export function writeJestFiles(root: string, answers: InitAnswers, options: WriteOptions = {}): boolean {
   return writeFiles(planJestFiles(root, answers), options);
}

export function addTestScript(root: string): void {
   const pkgPath = path.join(root, 'package.json');
   const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
   pkg.scripts = pkg.scripts || {};
   if (!pkg.scripts.test) {
      pkg.scripts.test = 'jest';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('Added "test": "jest" to package.json');
   }
}
