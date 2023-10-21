import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ValueObjectGeneratorSchema } from './schema';
import { capitalize } from '../../utils';

export async function valueObjectGenerator(
  tree: Tree,
  options: ValueObjectGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files/templates'),
    `${sourceRoot}/src/value-objects`,
    {
      name,
      capitalize,
    }
  );

  let indexContent = '';
  const indexFile = tree.read(`${sourceRoot}/src/value-objects/index.ts`);
  if (indexFile) {
    indexContent = indexFile.toString();
  }
  tree.write(
    `${sourceRoot}/src/value-objects/index.ts`,
    `export * from "./${name}.value-object"\n${indexContent}`
  );
  await formatFiles(tree);
}

export default valueObjectGenerator;
