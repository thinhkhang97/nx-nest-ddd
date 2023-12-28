import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainRepositoryGeneratorSchema } from './schema';

export async function domainRepositoryGenerator(
  tree: Tree,
  options: DomainRepositoryGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/repositories`
    : `libs/${subDomain}/domain/src/repositories`;
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
    `export * from "./${name}.repository"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainRepositoryGenerator;
