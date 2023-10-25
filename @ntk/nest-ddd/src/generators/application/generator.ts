import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import applicationQueryGenerator from './query/generator';
import { ApplicationGeneratorSchema } from './schema';
import * as path from 'path';
import { hyphenToCapital } from '../../utils';
import applicationCommandGenerator from './command/generator';

export async function applicationGenerator(
  tree: Tree,
  options: ApplicationGeneratorSchema
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
  await applicationQueryGenerator(tree, {
    name: `get-${name}`,
    sourceRoot: `libs/${name}/application`,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/queries`,
  });
  await applicationCommandGenerator(tree, {
    name: `create-${name}`,
    sourceRoot: `libs/${name}/application`,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/commands`,
  });
  generateFiles(
    tree,
    (templatePath && `${templatePath}/modules`) ||
      path.join(__dirname, 'files/modules'),
    `libs/${name}/application/src/modules`,
    {
      name,
      hyphenToCapital,
    }
  );
  await formatFiles(tree);
}

export default applicationGenerator;
