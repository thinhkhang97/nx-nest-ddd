import { Tree } from '@nx/devkit';

export function appendContent(tree: Tree, filePath: string, content: string) {
  let fileContent = '';
  const indexFile = tree.read(filePath);
  if (indexFile) {
    fileContent = indexFile.toString();
  }
  tree.write(filePath, `${fileContent}${content}`);
}
