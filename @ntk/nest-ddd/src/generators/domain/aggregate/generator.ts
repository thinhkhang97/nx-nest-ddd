import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainAggregateGeneratorSchema } from './schema';

export async function domainAggregateGenerator(
  tree: Tree,
  options: DomainAggregateGeneratorSchema
) {
  const { name, sourceRoot, skipFormat } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/aggregates`,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/aggregates/index.ts`,
    `export * from "./${name}.aggregate"`
  );
  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainAggregateGenerator;
