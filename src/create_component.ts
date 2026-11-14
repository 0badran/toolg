import { fileType, targetPath, genOpts } from './context.js';
import { writeFiles } from '../utils/utils.js';

export default function generateComponent(name: string): void {
   writeFiles([
      [`${targetPath}/components/${name}.${fileType}x`, `export default function ${name}(){
      return (
         <h1>${name}</h1>
      )}`],
      [`${targetPath}/components/${name}.test.${fileType}x`, `import {render, screen} from '@testing-library/react'
   import '@testing-library/jest-dom'
   import ${name} from './${name}';

   test("${name} renders successfully", () => {
      render(<${name}/>);
      const element = screen.getByText(/${name}/i);
      expect(element).toBeInTheDocument();
   });`],
   ], genOpts);
}
