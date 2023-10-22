import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { hyphenToCapital } from '../../../utils';
import { DomainAggregateGeneratorSchema } from './schema';

export async function domainAggregateGenerator(
  tree: Tree,
  options: DomainAggregateGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/aggregates`,
    {
      name,
      hyphenToCapital,
    }
  );

  let indexContent = '';
  const indexFile = tree.read(`${sourceRoot}/src/aggregates/index.ts`);
  if (indexFile) {
    indexContent = indexFile.toString();
  }
  tree.write(
    `${sourceRoot}/src/aggregates/index.ts`,
    `export * from "./${name}.aggregate"\n${indexContent}`
  );
  await formatFiles(tree);
}

export default domainAggregateGenerator;
