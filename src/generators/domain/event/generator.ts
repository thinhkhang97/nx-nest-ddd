import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainEventGeneratorSchema } from './schema';

export async function domainEventGenerator(
  tree: Tree,
  options: DomainEventGeneratorSchema
) {
  const { name, sourceRoot, domain, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/events`
    : `libs/${domain}/domain/src/events`;
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    hyphenToCapital,
  });
  appendContent(tree, `${target}/index.ts`, `export * from "./${name}.entity"`);

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainEventGenerator;
