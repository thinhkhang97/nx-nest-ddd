import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { GraphqlQueryGeneratorSchema } from './schema';
import ts = require('typescript');

function updateIndexFile(
  tree: Tree,
  { name, sourceRoot, subDomain }: GraphqlQueryGeneratorSchema,
  indexContent: string
) {
  const target = sourceRoot
    ? `${sourceRoot}/src/queries`
    : `libs/${subDomain}/graphql-ui/src/queries`;
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(name)}Query } from './${name}.query'`
  );
  // Update query array
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="queries"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}Query`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(`${target}/index.ts`, indexContent);
}

export async function graphqlQueryGenerator(
  tree: Tree,
  options: GraphqlQueryGeneratorSchema
) {
  const { subDomain, name, sourceRoot, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/queries`
    : `libs/${subDomain}/graphql-ui/src/queries`;
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

export default graphqlQueryGenerator;
