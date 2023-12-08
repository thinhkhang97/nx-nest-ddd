import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import {
  appendContent,
  hyphenToCapital,
  hyphenToSnakeCase,
} from '../../../utils';
import { DomainExceptionGeneratorSchema } from './schema';

export async function domainExceptionGenerator(
  tree: Tree,
  options: DomainExceptionGeneratorSchema
) {
  const { name, sourceRoot, skipFormat, templatePath } = options;
  generateFiles(
    tree,
    templatePath || path.join(__dirname, 'files'),
    `${sourceRoot}/src/exceptions`,
    {
      name,
      hyphenToCapital,
      hyphenToSnakeCase,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/exceptions/index.ts`,
    `export * from "./${name}.exception"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainExceptionGenerator;
