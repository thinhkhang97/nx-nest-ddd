import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import {
  appendContent,
  hyphenToCapital,
  hyphenToSnakeCase,
} from '../../../utils';
import { DomainExceptionGeneratorSchema } from './schema';

export async function domainExceptionGenerator(
  tree: Tree,
  options: DomainExceptionGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/exceptions`
    : `libs/${subDomain}/domain/src/exceptions`;
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    hyphenToCapital,
    hyphenToSnakeCase,
  });
  appendContent(
    tree,
    `${target}/index.ts`,
    `export * from "./${name}.exception"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainExceptionGenerator;
