import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, capitalize } from '../../../utils';
import { DomainEntityGeneratorSchema } from './schema';

export async function domainEntityGenerator(
  tree: Tree,
  options: DomainEntityGeneratorSchema
) {
  const { name, sourceRoot, skipFormat } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/entities`,
    {
      name,
      capitalize,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/entities/index.ts`,
    `export * from "./${name}.entity"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainEntityGenerator;
