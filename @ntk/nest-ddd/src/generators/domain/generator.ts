import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import domainAggregateGenerator from './aggregate/generator';
import domainEventGenerator from './event/generator';
import { DomainGeneratorSchema } from './schema';
import * as path from 'path';
import domainExceptionGenerator from './exception/generator';
import domainRepositoryGenerator from './repository/generator';

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
    skipFormat: true,
  });
  tree.delete(`libs/${name}/domain/src/lib`);
  await domainAggregateGenerator(tree, {
    name,
    sourceRoot: `libs/${name}/domain`,
    skipFormat: true,
  });
  await domainEventGenerator(tree, {
    name: `${name}-created`,
    sourceRoot: `libs/${name}/domain`,
    skipFormat: true,
  });
  await domainExceptionGenerator(tree, {
    name: `${name}-not-found`,
    sourceRoot: `libs/${name}/domain`,
    skipFormat: true,
  });
  await domainRepositoryGenerator(tree, {
    name,
    sourceRoot: `libs/${name}/domain`,
    skipFormat: true,
  });
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `libs/${name}/domain/src`,
    {}
  );
  await formatFiles(tree);
}

export default domainGenerator;
