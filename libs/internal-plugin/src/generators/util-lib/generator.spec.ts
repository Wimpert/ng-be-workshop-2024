import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { utilLibGenerator } from './generator';
import { UtilLibGeneratorSchema } from './schema';

describe('util-lib generator', () => {
  let tree: Tree;
  const options: UtilLibGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await utilLibGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });

  it('should create the correct directory structure', async () => {
    await utilLibGenerator(tree, { name: 'test', directory: 'shared' });
    const config = readProjectConfiguration(tree, 'shared-util-test');
    expect(config).toBeDefined();
    expect(config.root).toBe('libs/shared/util-test');
  });

  it('should use the default directory if none is provided', async () => {
    await utilLibGenerator(tree, { name: 'test' });
    const config = readProjectConfiguration(tree, 'test-util-test');
    expect(config).toBeDefined();
    expect(config.root).toBe('libs/test/util-test');
  });

  it('should format files after generation', async () => {
    const formatFilesSpy = jest.spyOn(require('@nx/devkit'), 'formatFiles');
    await utilLibGenerator(tree, options);
    expect(formatFilesSpy).toHaveBeenCalled();
  });

  it('should log the correct name and directory', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    await utilLibGenerator(tree, { name: 'test', directory: 'shared' });
    expect(consoleLogSpy).toHaveBeenCalledWith('The name is: ', 'util-test');
    expect(consoleLogSpy).toHaveBeenCalledWith('The directory is', 'shared');
  });
});
