import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, hyphenToCapital } from '../../../utils';
import { DomainEventGeneratorSchema } from './schema';

export async function domainEventGenerator(
  tree: Tree,
  options: DomainEventGeneratorSchema
) {
  const { name, sourceRoot, skipFormat, templatePath } = options;
  generateFiles(
    tree,
    templatePath || path.join(__dirname, 'files'),
    `${sourceRoot}/src/events`,
    {
      name,
      hyphenToCapital,
    }
  );
  appendContent(
    tree,
    `${sourceRoot}/src/events/index.ts`,
    `export * from "./${name}.entity"`
  );

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainEventGenerator;
