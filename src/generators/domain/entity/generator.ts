import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { appendContent, capitalize } from '../../../utils';
import { DomainEntityGeneratorSchema } from './schema';

export async function domainEntityGenerator(
  tree: Tree,
  options: DomainEntityGeneratorSchema
) {
  const { name, sourceRoot, domain, skipFormat, templatePath } = options;
  let target = `libs/${domain}/domain/src/entities`;
  if (sourceRoot) {
    target = `${sourceRoot}/src/entities`;
  }
  generateFiles(tree, templatePath || path.join(__dirname, 'files'), target, {
    name,
    capitalize,
  });
  appendContent(tree, `${target}/index.ts`, `export * from "./${name}.entity"`);

  if (!skipFormat) {
    await formatFiles(tree);
  }
}

export default domainEntityGenerator;
