import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { DomainEventGeneratorSchema } from './schema';
import { hyphenToCapital } from '../../../utils';

export async function domainEventGenerator(
  tree: Tree,
  options: DomainEventGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/events`,
    {
      name,
      hyphenToCapital,
    }
  );

  let indexContent = '';
  const indexFile = tree.read(`${sourceRoot}/src/events/index.ts`);
  if (indexFile) {
    indexContent = indexFile.toString();
  }
  tree.write(
    `${sourceRoot}/src/events/index.ts`,
    `export * from "./${name}.entity"\n${indexContent}`
  );
  await formatFiles(tree);
}

export default domainEventGenerator;
