import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { AggregateGeneratorSchema } from './schema';
import { capitalize } from '../../utils';

export async function aggregateGenerator(
  tree: Tree,
  options: AggregateGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/aggregates`,
    {
      name,
      capitalize,
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

export default aggregateGenerator;
