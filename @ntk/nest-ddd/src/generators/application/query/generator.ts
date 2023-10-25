import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import * as ts from 'typescript';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { ApplicationQueryGeneratorSchema } from './schema';

function updateIndexFile(
  tree: Tree,
  { name, sourceRoot }: ApplicationQueryGeneratorSchema,
  indexContent: string
) {
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ExportDeclaration',
    `export * from "./${name}/${name}.query"`
  );
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(
      name
    )}QueryHandler } from './${name}/${name}.query-handler'`
  );
  // Update query array
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="queries"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}QueryHandler`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(`${sourceRoot}/src/queries/index.ts`, indexContent);
}

export async function applicationQueryGenerator(
  tree: Tree,
  options: ApplicationQueryGeneratorSchema
) {
  const { name, sourceRoot, skipFormat } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/queries`,
    {
      name,
      hyphenToCapital,
    }
  );
  const indexContent = tree
    .read(`${sourceRoot}/src/queries/index.ts`)
    ?.toString();
  if (!indexContent) {
    generateFiles(
      tree,
      path.join(__dirname, 'index'),
      `${sourceRoot}/src/queries`,
      {
        name,
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

export default applicationQueryGenerator;
