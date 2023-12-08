import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainAggregateGeneratorSchema } from './schema';

export async function domainAggregateGenerator(
  tree: Tree,
  options: DomainAggregateGeneratorSchema
) {
  const { name, domain, sourceRoot, skipFormat, templatePath } = options;
  let target = `libs/${domain}/domain/src/aggregates`;
  if (sourceRoot) {
    target = `${sourceRoot}/src/aggregates`;
  }
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    hyphenToCapital,
  });
  appendContent(
    tree,
    `${target}/index.ts`,
    `export * from "./${name}.aggregate"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainAggregateGenerator;
