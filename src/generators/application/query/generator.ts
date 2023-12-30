import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import * as ts from 'typescript';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { ApplicationQueryGeneratorSchema } from './schema';

function updateIndexFile(
  tree: Tree,
  { name, sourceRoot, subDomain }: ApplicationQueryGeneratorSchema,
  indexContent: string
) {
  const target = sourceRoot
    ? `${sourceRoot}/src/queries`
    : `libs/${subDomain}/application/src/queries`;
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
    'Identifier[name="queryHandlers"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}QueryHandler`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(`${target}/index.ts`, indexContent);
}

export async function applicationQueryGenerator(
  tree: Tree,
  options: ApplicationQueryGeneratorSchema
) {
  const { name, subDomain, sourceRoot, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/queries`
    : `libs/${subDomain}/application/src/queries`;
  generateFiles(
    tree,
    templatePath ? `${templatePath}/files` : path.join(__dirname, 'files'),
    target,
    {
      name,
      hyphenToCapital,
    }
  );
  const indexContent = tree.read(`${target}/index.ts`)?.toString();
  if (!indexContent) {
    generateFiles(
      tree,
      templatePath ? `${templatePath}/index` : path.join(__dirname, 'index'),
      target,
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
