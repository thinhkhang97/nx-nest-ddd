import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { ApplicationEventGeneratorSchema } from './schema';
import ts = require('typescript');

function updateIndexFile(
  tree: Tree,
  { name, sourceRoot }: ApplicationEventGeneratorSchema,
  indexContent: string
) {
  indexContent = appendContentAfterLatestNode(
    indexContent,
    'ImportDeclaration',
    `import { ${hyphenToCapital(
      name
    )}EventHandler } from './${name}.event-handler'`
  );
  // Update query array
  indexContent = tsquery.replace(
    indexContent,
    'Identifier[name="eventHandlers"] ~ ArrayLiteralExpression',
    (node: ts.ArrayLiteralExpression) => {
      return `[${node.elements
        .map((e) => e.getText())
        .concat(`${hyphenToCapital(name)}EventHandler`)
        .join(',')}]`;
    },
    ts.ScriptKind.TS
  );
  tree.write(`${sourceRoot}/src/events/index.ts`, indexContent);
}

export async function applicationEventGenerator(
  tree: Tree,
  options: ApplicationEventGeneratorSchema
) {
  const { eventName, name, sourceRoot, skipFormat, templatePath } = options;
  generateFiles(
    tree,
    templatePath || path.join(__dirname, 'files'),
    `${sourceRoot}/src/events`,
    {
      name,
      eventName,
      hyphenToCapital,
    }
  );
  const indexContent = tree
    .read(`${sourceRoot}/src/events/index.ts`)
    ?.toString();
  if (!indexContent) {
    generateFiles(
      tree,
      path.join(__dirname, 'index'),
      `${sourceRoot}/src/events`,
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

export default applicationEventGenerator;
