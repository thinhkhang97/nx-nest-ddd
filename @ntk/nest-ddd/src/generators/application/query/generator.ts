import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { hyphenToCapital } from '../../../utils';
import { ApplicationQueryGeneratorSchema } from './schema';
import { ast, tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

export async function applicationQueryGenerator(
  tree: Tree,
  options: ApplicationQueryGeneratorSchema
) {
  const { name, sourceRoot } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/queries`,
    {
      name,
      hyphenToCapital,
    }
  );

  let indexContent = tree
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
    const indexAST = ast(indexContent);
    // Update export in index file
    const exportNodes = tsquery.match(indexAST, 'ExportDeclaration');
    const latestExportNode = exportNodes[exportNodes.length - 1];
    if (!latestExportNode) {
      throw new Error('Wrong query index file format');
    }
    const latestExportContent = latestExportNode.getFullText();
    indexContent = indexContent.replace(
      latestExportContent,
      `${latestExportContent}\nexport * from "./${name}/${name}.query"`
    );

    // Update import in index file
    const importNodes = tsquery.match(indexAST, 'ImportDeclaration');
    const latestImportNode = importNodes[importNodes.length - 1];
    if (!latestImportNode) {
      throw new Error('Wrong query index file format');
    }
    const latestImportContent = latestImportNode.getFullText();
    indexContent = indexContent.replace(
      latestImportContent,
      `${latestImportContent}\nimport { ${hyphenToCapital(
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
  }

  tree.write(`${sourceRoot}/src/queries/index.ts`, indexContent);

  await formatFiles(tree);
}

export default applicationQueryGenerator;
