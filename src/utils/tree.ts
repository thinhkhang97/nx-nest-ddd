import { Tree } from '@nx/devkit';
import { ast, tsquery } from '@phenomnomnominal/tsquery';

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
