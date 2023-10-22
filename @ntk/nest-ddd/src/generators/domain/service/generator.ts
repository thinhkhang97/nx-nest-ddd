import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainServiceGeneratorSchema } from './schema';

export async function domainServiceGenerator(
  tree: Tree,
  options: DomainServiceGeneratorSchema
) {
  const { name, sourceRoot, skipFormat } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/services`,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/services/index.ts`,
    `export * from "./${name}.service"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainServiceGenerator;
