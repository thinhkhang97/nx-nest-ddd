import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { ApplicationCommandGeneratorSchema } from './schema';
import ts = require('typescript');

function updateIndexFile(
  tree: Tree,
  { name, subDomain, sourceRoot }: ApplicationCommandGeneratorSchema,
  indexContent: string
) {
  const target = sourceRoot
    ? `${sourceRoot}/src/commands/index.ts`
    : `libs/${subDomain}/application/src/commands/index.ts`;
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ExportDeclaration',
    `export * from "./${name}/${name}.command"`
  );
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(
      name
    )}CommandHandler } from './${name}/${name}.command-handler'`
  );
  // Update command array
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="commandHandlers"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}CommandHandler`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(target, indexContent);
}

export async function applicationCommandGenerator(
  tree: Tree,
  options: ApplicationCommandGeneratorSchema
) {
  const { name, subDomain, sourceRoot, skipFormat, templatePath } = options;
  const target = sourceRoot
    ? `${sourceRoot}/src/commands`
    : `libs/${subDomain}/application/src/commands`;
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

export default applicationCommandGenerator;
