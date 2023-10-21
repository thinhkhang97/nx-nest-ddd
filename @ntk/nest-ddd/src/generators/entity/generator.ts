import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { capitalize } from '../../utils';
import { EntityGeneratorSchema } from './schema';

export async function entityGenerator(
  tree: Tree,
  options: EntityGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files/templates'),
    `${sourceRoot}/src/entities`,
    {
      name,
      capitalize,
    }
  );

  let indexContent = '';
  const indexFile = tree.read(`${sourceRoot}/src/entities/index.ts`);
  if (indexFile) {
    indexContent = indexFile.toString();
  }
  tree.write(
    `${sourceRoot}/src/entities/index.ts`,
    `export * from "./${name}.entity"\n${indexContent}`
  );
  await formatFiles(tree);
}

export default entityGenerator;
