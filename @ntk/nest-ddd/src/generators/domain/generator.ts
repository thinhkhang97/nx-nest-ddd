import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import domainAggregateGenerator from './aggregate/generator';
import { DomainGeneratorSchema } from './schema';

export async function domainGenerator(
  tree: Tree,
  { name }: DomainGeneratorSchema
) {
  libraryGenerator(tree, {
    name: `${name}/domain`,
  });
  domainAggregateGenerator(tree, { name, sourceRoot: `libs/${name}/domain` });
  await formatFiles(tree);
}

export default domainGenerator;
