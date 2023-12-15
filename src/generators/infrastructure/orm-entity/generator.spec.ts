import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { infrastructureOrmEntityGenerator } from './generator';
import { InfrastructureOrmEntityGeneratorSchema } from './schema';

describe('infrastructure-orm-entity generator', () => {
  let tree: Tree;
  const options: InfrastructureOrmEntityGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await infrastructureOrmEntityGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
