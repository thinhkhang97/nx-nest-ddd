import { Tree } from '@nx/devkit';
import { ast, tsquery } from '@phenomnomnominal/tsquery';
import { ExtractedProperty } from '../types/ast';
import ts = require('typescript');

export function appendContent(tree: Tree, filePath: string, content: string) {
  let fileContent = '';
  const indexFile = tree.read(filePath);
  if (indexFile) {
    fileContent = indexFile.toString();
  }
  tree.write(filePath, `${fileContent}${content}`);
}

export function appendContentAfterLatestNode(
  originalContent: string,
  query: string,
  insertContent: string
) {
  const contentAST = ast(originalContent);
  const nodes = tsquery.match(contentAST, query);
  const latestNode = nodes[nodes.length - 1];
  if (!latestNode) {
    return;
  }
  const latestNodeContent = latestNode.getFullText();
  return originalContent.replace(
    latestNodeContent,
    `${latestNodeContent}\n${insertContent}`
  );
}

export const extractPropertiesFromInterface = (
  ast: ts.Node,
  interfaceName: string
): ExtractedProperty[] => {
  const insurerPropsInterface = tsquery(
    ast,
    `InterfaceDeclaration:has(Identifier[name="${interfaceName}"])`
  )[0];
  if (insurerPropsInterface === undefined) {
    return [];
  }
  const properties = tsquery(insurerPropsInterface, 'PropertySignature');
  const result = [];
  properties.forEach((property) => {
    const name = tsquery(property, 'Identifier')[0]?.getText();
    let type = tsquery(property, 'TypeReference > Identifier')[0]?.getText();
    const nullable = tsquery(property, 'NullKeyword').length > 0;
    const isUndefined = tsquery(property, 'QuestionToken').length > 0;
    const inferredType = tsquery(property, 'StringKeyword')[0]?.getText();
    if (inferredType) {
      type = inferredType;
    }
    result.push({ name, type, nullable, isUndefined });
  });

  return result;
};
