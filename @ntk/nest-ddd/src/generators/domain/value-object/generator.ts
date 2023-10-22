import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, capitalize, hyphenToCapital } from '../../../utils';
import { DomainValueObjectGeneratorSchema } from './schema';

export async function domainValueObjectGenerator(
  tree: Tree,
  options: DomainValueObjectGeneratorSchema
) {
  const { name, sourceRoot, skipFormat } = options;
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${sourceRoot}/src/value-objects`,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/value-objects/index.ts`,
    `export * from "./${name}.value-object"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainValueObjectGenerator;
