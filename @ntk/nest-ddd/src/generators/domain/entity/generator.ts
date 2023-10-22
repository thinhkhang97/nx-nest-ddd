import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { capitalize } from '../../../utils';
import { DomainEntityGeneratorSchema } from './schema';

export async function domainEntityGenerator(
  tree: Tree,
  options: DomainEntityGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
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

export default domainEntityGenerator;
