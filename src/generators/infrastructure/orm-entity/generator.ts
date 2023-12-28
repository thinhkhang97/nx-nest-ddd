import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';

import { InfrastructureOrmEntityGeneratorSchema } from './schema';

export async function infrastructureOrmEntityGenerator(
  tree: Tree,
  options: InfrastructureOrmEntityGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  let target = `libs/${subDomain}/infrastructure/src/orm-entities`;
  if (sourceRoot) {
    target = `${sourceRoot}/src/orm-entities`;
  }
  generateFiles(
    tree,
    templatePath ? `${templatePath}/files` : path.join(__dirname, 'files'),
    target,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${target}/index.ts`,
    `export * from "./${name}.orm-entity"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default infrastructureOrmEntityGenerator;
