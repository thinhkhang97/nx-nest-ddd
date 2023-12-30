import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { appendContentAfterLatestNode, hyphenToCapital } from '../../../utils';
import { ApplicationEventGeneratorSchema } from './schema';
import ts = require('typescript');

function updateIndexFile(
  tree: Tree,
  { name, sourceRoot, subDomain }: ApplicationEventGeneratorSchema,
  indexContent: string
) {
  const target = sourceRoot
    ? `${sourceRoot}/src/events`
    : `libs/${subDomain}/application/src/events`;
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
  tree.write(`${target}/index.ts`, indexContent);
}

export async function applicationEventGenerator(
  tree: Tree,
  options: ApplicationEventGeneratorSchema
) {
  const { eventName, subDomain, name, sourceRoot, skipFormat, templatePath } =
    options;
  const target = sourceRoot
    ? `${sourceRoot}/src/events`
    : `libs/${subDomain}/application/src/events`;
  generateFiles(
    tree,
    templatePath ? `${templatePath}/files` : path.join(__dirname, 'files'),
    target,
    {
      name,
      eventName,
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

export default applicationEventGenerator;
