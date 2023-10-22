import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { capitalize } from '../../../utils';
import { DomainValueObjectGeneratorSchema } from './schema';

export async function domainValueObjectGenerator(
  tree: Tree,
  options: DomainValueObjectGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
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

export default domainValueObjectGenerator;
