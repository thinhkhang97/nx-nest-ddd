import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainServiceGeneratorSchema } from './schema';

export async function domainServiceGenerator(
  tree: Tree,
  options: DomainServiceGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/services`
    : `libs/${subDomain}/domain/src/services`;
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
    `export * from "./${name}.service"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainServiceGenerator;
