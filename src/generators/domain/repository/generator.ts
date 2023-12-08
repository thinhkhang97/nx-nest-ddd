import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainRepositoryGeneratorSchema } from './schema';

export async function domainRepositoryGenerator(
  tree: Tree,
  options: DomainRepositoryGeneratorSchema
) {
  const { name, sourceRoot, skipFormat, templatePath } = options;
  generateFiles(
    tree,
    templatePath || path.join(__dirname, 'files'),
    `${sourceRoot}/src/repositories`,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/repositories/index.ts`,
    `export * from "./${name}.repository"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainRepositoryGenerator;
