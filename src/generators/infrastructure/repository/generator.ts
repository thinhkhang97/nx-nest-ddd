import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { InfrastructureRepositoryGeneratorSchema } from './schema';
import { tsquery } from '@phenomnomnominal/tsquery';
import ts = require('typescript');
import { InfrastructureOrmMapperGeneratorSchema } from '../orm-mapper/schema';

export async function infrastructureRepositoryGenerator(
  tree: Tree,
  options: InfrastructureRepositoryGeneratorSchema
) {
  const { name, sourceRoot, subDomain, skipFormat, templatePath } = options;
  let target = `libs/${subDomain}/infrastructure/src/repositories`;
  if (sourceRoot) {
    target = `${sourceRoot}/src/repositories`;
  }
  generateFiles(
    tree,
    templatePath ? `${templatePath}/files` : path.join(__dirname, 'files'),
    target,
    {
      name,
      subDomain,
      hyphenToCapital,
    }
  );

  const indexContent = tree.read(`${target}/index.ts`)?.toString();
  if (!indexContent) {
    generateFiles(
      tree,
      templatePath
        ? `${templatePath}/index`
        : templatePath
        ? `${templatePath}/index`
        : path.join(__dirname, 'index'),
      target,
      {
        name,
        subDomain,
        hyphenToCapital,
      }
    );
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
    ? `${sourceRoot}/src/repositories/index.ts`
    : `libs/${subDomain}/infrastructure/src/repositories/index.ts`;
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(
      name
    )}OrmRepository} from './${name}.orm-repository'`
  );
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(
      name
    )}Repository} from '@project/${subDomain}/domain'`
  );
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="repositories"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(
          `{provide: ${hyphenToCapital(
            name
          )}Repository, useClass: ${hyphenToCapital(name)}OrmRepository}`
        )
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(target, indexContent);
}

export default infrastructureRepositoryGenerator;
