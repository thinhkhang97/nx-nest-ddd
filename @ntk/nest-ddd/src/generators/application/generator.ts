import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import { ApplicationGeneratorSchema } from './schema';
import applicationQueryGenerator from './query/generator';

export async function applicationGenerator(
  tree: Tree,
  options: ApplicationGeneratorSchema
) {
  const { name, tags, templatePath } = options;
  await libraryGenerator(tree, {
    ...options,
    name: `libs/${name}/application`,
    projectNameAndRootFormat: 'as-provided',
    tags: tags ? `layer:application,${tags}` : `layer:application`,
  });
  await applicationQueryGenerator(tree, {
    name: `get-${name}`,
    sourceRoot: `libs/${name}/application`,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/queries`,
  });
  await formatFiles(tree);
}

export default applicationGenerator;
