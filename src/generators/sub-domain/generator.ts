import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { applicationGenerator } from '@nx/nest';
import * as path from 'path';
import { hyphenToCapital } from '../../utils';
import domainApplicationGenerator from '../application/generator';
import domainGenerator from '../domain/generator';
import graphqlUiGenerator from '../graphql-ui/generator';
import infrastructureGenerator from '../infrastructure/generator';
import { SubDomainGeneratorSchema } from './schema';

export async function subDomainGenerator(
  tree: Tree,
  options: SubDomainGeneratorSchema
) {
  const {
    name,
    templatePath,
    projectNameAndRootFormat,
    directory,
    prefixImport,
  } = options;
  await applicationGenerator(tree, {
    ...options,
    projectNameAndRootFormat: projectNameAndRootFormat || 'as-provided',
    name: `${name}-api`,
    directory: directory || `apps/${name}/api`,
    tags: 'scope:app',
  });
  tree.delete(`apps/${name}/api/src/app`);
  tree.delete(`apps/${name}/api/src/main.ts`);
  await domainGenerator(tree, {
    name,
    importPath: `${prefixImport}/${name}/domain`,
    tags: `scope:${name}`,
    templatePath: templatePath && `${templatePath}/lib/domain`,
  });
  await infrastructureGenerator(tree, {
    name,
    importPath: `${prefixImport}/${name}/infrastructure`,
    tags: `scope:${name}`,
    templatePath: templatePath && `${templatePath}/lib/infrastructure`,
  });
  await domainApplicationGenerator(tree, {
    name,
    importPath: `${prefixImport}/${name}/application`,
    tags: `scope:${name}`,
    templatePath: templatePath && `${templatePath}/lib/application`,
  });
  await graphqlUiGenerator(tree, {
    name,
    importPath: `${prefixImport}/${name}/graphql-ui`,
    tags: `scope:${name}`,
    templatePath: templatePath && `${templatePath}/lib/graphql-ui`,
  });
  generateFiles(
    tree,
    (templatePath && `${templatePath}/api`) ||
      path.join(__dirname, 'files/api'),
    `apps/${name}/api/src`,
    {
      name,
      hyphenToCapital,
    }
  );
  await formatFiles(tree);
}

export default subDomainGenerator;
