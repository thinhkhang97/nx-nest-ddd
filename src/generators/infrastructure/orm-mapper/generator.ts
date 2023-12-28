import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import {
  appendContentAfterLatestNode,
  extractPropertiesFromInterface,
  hyphenToCapital,
} from '../../../utils';
import { InfrastructureOrmMapperGeneratorSchema } from './schema';
import ts = require('typescript');

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
    ?.toString();
  const { toOrmProps, toDomainProps } = getMatchProps(fileContent || '', name);
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    subDomain,
    hyphenToCapital,
    toOrmProps,
    toDomainProps,
  });

  const indexContent = tree.read(`${target}/index.ts`)?.toString();
  if (!indexContent) {
    generateFiles(tree, path.join(__dirname, 'index'), target, {
      name,
      hyphenToCapital,
    });
  } else {
    updateIndexFile(tree, options, indexContent);
  }

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

function updateIndexFile(
  tree: Tree,
  { name, subDomain, sourceRoot }: InfrastructureOrmMapperGeneratorSchema,
  indexContent: string
) {
  const target = sourceRoot
    ? `${sourceRoot}/src/orm-mappers/index.ts`
    : `libs/${subDomain}/infrastructure/src/orm-mappers/index.ts`;
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ExportDeclaration',
    `export * from "./${name}.orm-mapper"`
  );
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(name)}OrmMapper } from './${name}.orm-mapper'`
  );
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="ormMappers"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}OrmMapper`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(target, indexContent);
}

const getMatchProps = (fileContent: string, name: string) => {
  const ast = tsquery.ast(fileContent);
  if (ast === undefined) {
    return null;
  }
  const properties = extractPropertiesFromInterface(
    ast,
    `${hyphenToCapital(name)}Props`
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
  return { toOrmProps, toDomainProps };
};

export default infrastructureOrmMapperGenerator;
