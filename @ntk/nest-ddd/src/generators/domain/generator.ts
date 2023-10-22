import { Tree, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import domainAggregateGenerator from './aggregate/generator';
import domainEventGenerator from './event/generator';
import { DomainGeneratorSchema } from './schema';
import * as path from 'path';

export async function domainGenerator(
  tree: Tree,
  options: DomainGeneratorSchema
) {
  const { name, tags } = options;
  await libraryGenerator(tree, {
    name: `libs/${name}/domain`,
    target: 'es2021',
    projectNameAndRootFormat: 'as-provided',
    tags: tags ? `layer:domain,${tags}` : `layer:domain`,
  });
  tree.delete(`libs/${name}/domain/src/lib`);
  await domainAggregateGenerator(tree, {
    name,
    sourceRoot: `libs/${name}/domain`,
  });
  await domainEventGenerator(tree, {
    name: `${name}-created`,
    sourceRoot: `libs/${name}/domain`,
  });
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `libs/${name}/domain/src`,
    {}
  );
}

export default domainGenerator;
