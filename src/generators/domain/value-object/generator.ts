import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainValueObjectGeneratorSchema } from './schema';

export async function domainValueObjectGenerator(
  tree: Tree,
  options: DomainValueObjectGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/value-objects`
    : `libs/${subDomain}/domain/src/value-objects`;
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
    `export * from "./${name}.value-object"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainValueObjectGenerator;
