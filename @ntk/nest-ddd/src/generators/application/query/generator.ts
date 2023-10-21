import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { hyphenToCapital } from '../../../utils';
import { ApplicationQueryGeneratorSchema } from './schema';

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

  // let indexContent = '';
  // const indexFile = tree.read(`${sourceRoot}/src/queries/index.ts`);
  // if (indexFile) {
  //   indexContent = indexFile.toString();
  // }
  // tree.write(
  //   `${sourceRoot}/src/queries/index.ts`,
  //   `export * from "./${name}.value-object"\n${indexContent}`
  // );
  await formatFiles(tree);
}

export default applicationQueryGenerator;
