import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, capitalize } from '../../../utils';
import { InfrastructureOrmMapperGeneratorSchema } from './schema';

export async function infrastructureOrmMapperGenerator(
  tree: Tree,
  options: InfrastructureOrmMapperGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  let target = `libs/${subDomain}/infrastructure/src/orm-mappers`;
  if (sourceRoot) {
    target = `${sourceRoot}/src/orm-mappers`;
  }
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    subDomain,
    capitalize,
  });
  appendContent(
    tree,
    `${target}/index.ts`,
    `export * from "./${name}.orm-mapper"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default infrastructureOrmMapperGenerator;
