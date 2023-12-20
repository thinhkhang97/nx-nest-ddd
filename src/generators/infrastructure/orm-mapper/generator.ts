import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import {
  appendContent,
  capitalize,
  extractPropertiesFromInterface,
} from '../../../utils';
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
  const fileContent = tree
    .read(`libs/${subDomain}/domain/src/aggregates/${name}.aggregate.ts`)
    .toString();
  const ast = tsquery.ast(fileContent);
  const properties = extractPropertiesFromInterface(
    ast,
    `${capitalize(name)}Props`
  );
  const toOrmProps = properties
    .map((property) => {
      if (property.isUndefined || property.nullable) {
        return `${property.name}: props.${property.name} ?? null`;
      }
      return `${property.name}: props.${property.name}`;
    })
    .join(',');
  const toDomainProps = properties
    .map((property) => {
      return `${property.name}: ormEntity.${property.name}`;
    })
    .join(',');
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    subDomain,
    capitalize,
    toOrmProps,
    toDomainProps,
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
