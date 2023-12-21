import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import * as path from 'path';
import { hyphenToCapital } from '../../utils';
import infrastructureOrmEntityGenerator from './orm-entity/generator';
import infrastructureOrmMapperGenerator from './orm-mapper/generator';
import infrastructureRepositoryGenerator from './repository/generator';
import { InfrastructureGeneratorSchema } from './schema';

export async function infrastructureGenerator(
  tree: Tree,
  options: InfrastructureGeneratorSchema
) {
  const { name, tags, templatePath } = options;
  await libraryGenerator(tree, {
    ...options,
    name: `${name}-application`,
    directory: `libs/${name}/application`,
    projectNameAndRootFormat: 'as-provided',
    tags: tags ? `layer:application,${tags}` : `layer:application`,
  });
  tree.delete(`libs/${name}/application/src/lib`);
  tree.write(
    `libs/${name}/application/src/index.ts`,
    `export * from './modules/${name}-application.module';`
  );
  await infrastructureOrmEntityGenerator(tree, {
    name: `${name}`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/orm-entities`,
  });
  await infrastructureOrmMapperGenerator(tree, {
    name: `${name}`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/orm-mappers`,
  });
  await infrastructureRepositoryGenerator(tree, {
    name: `${name}`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/repositories`,
  });
  generateFiles(
    tree,
    (templatePath && `${templatePath}/modules`) ||
      path.join(__dirname, 'files/modules'),
    `libs/${name}/infrastructure/src/modules`,
    {
      name,
      hyphenToCapital,
    }
  );
  await formatFiles(tree);
}

export default infrastructureGenerator;
