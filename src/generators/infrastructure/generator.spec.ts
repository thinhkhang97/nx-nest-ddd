import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { infrastructureGenerator } from './generator';
import { InfrastructureGeneratorSchema } from './schema';

describe('infrastructure generator', () => {
  let tree: Tree;
  const options: InfrastructureGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await infrastructureGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
