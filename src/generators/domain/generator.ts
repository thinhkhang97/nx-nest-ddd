import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import domainAggregateGenerator from './aggregate/generator';
import domainEventGenerator from './event/generator';
import { DomainGeneratorSchema } from './schema';
import * as path from 'path';
import domainExceptionGenerator from './exception/generator';
import domainRepositoryGenerator from './repository/generator';
import domainServiceGenerator from './service/generator';

export async function domainGenerator(
  tree: Tree,
  options: DomainGeneratorSchema
) {
  const { name, tags, templatePath } = options;
  await libraryGenerator(tree, {
    ...options,
    name: `${name}-domain`,
    directory: `libs/${name}/domain`,
    projectNameAndRootFormat: 'as-provided',
    tags: tags ? `type:domain,${tags}` : `type:domain`,
  });
  tree.delete(`libs/${name}/domain/src/lib`);
  await domainAggregateGenerator(tree, {
    name,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/aggregates`,
  });
  await domainEventGenerator(tree, {
    name: `${name}-created`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/events`,
  });
  await domainExceptionGenerator(tree, {
    name: `${name}-not-found`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/exceptions`,
  });
  await domainRepositoryGenerator(tree, {
    name,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/repositories`,
  });
  await domainServiceGenerator(tree, {
    name,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/services`,
  });
  generateFiles(
    tree,
    templatePath
      ? templatePath && `${templatePath}/files`
      : path.join(__dirname, 'files'),
    `libs/${name}/domain/src`,
    {}
  );
  await formatFiles(tree);
}

export default domainGenerator;
