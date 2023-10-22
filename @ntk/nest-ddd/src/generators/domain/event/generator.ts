import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainEventGeneratorSchema } from './schema';

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
  appendContent(
    tree,
    `${sourceRoot}/src/events/index.ts`,
    `export * from "./${name}.entity"`
  );
  await formatFiles(tree);
}

export default domainEventGenerator;
