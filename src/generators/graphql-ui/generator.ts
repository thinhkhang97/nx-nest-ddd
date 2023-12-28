import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import * as path from 'path';
import { hyphenToCapital } from '../../utils';
import graphqlMutationGenerator from './mutation/generator';
import graphqlQueryGenerator from './query/generator';
import { GraphqlUiGeneratorSchema } from './schema';

export async function graphqlUiGenerator(
  tree: Tree,
  options: GraphqlUiGeneratorSchema
) {
  const { name, tags, templatePath } = options;
  await libraryGenerator(tree, {
    ...options,
    name: `${name}-graphql-ui`,
    directory: `libs/${name}/graphql-ui`,
    projectNameAndRootFormat: 'as-provided',
    tags: tags ? `layer:ui,${tags}` : `layer:ui`,
  });
  tree.delete(`libs/${name}/graphql-ui/src/lib`);
  tree.write(
    `libs/${name}/graphql-ui/src/index.ts`,
    `export * from './modules/${name}-graphql-ui.module';`
  );
  await graphqlMutationGenerator(tree, {
    name: `create-${name}`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/mutations`,
  });
  await graphqlQueryGenerator(tree, {
    name: `get-${name}`,
    subDomain: name,
    skipFormat: true,
    templatePath: templatePath && `${templatePath}/queries`,
  });
  generateFiles(
    tree,
    (templatePath && `${templatePath}/modules`) ||
      path.join(__dirname, 'files/modules'),
    `libs/${name}/graphql-ui/src/modules`,
    {
      name,
      hyphenToCapital,
    }
  );
  await formatFiles(tree);
}

export default graphqlUiGenerator;
