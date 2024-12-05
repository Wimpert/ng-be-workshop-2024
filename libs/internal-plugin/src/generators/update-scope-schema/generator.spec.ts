import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { updateScopeSchemaGenerator } from './generator';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

describe('update-scope-schema generator', () => {
  let tree: Tree;
  const options: UpdateScopeSchemaGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await updateScopeSchemaGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });

  it('should update schema.d.ts with new scopes', async () => {
    const base = 'libs/internal-plugin/src/generators/util-lib';
    tree.write(
      `${base}/schema.d.ts`,
      `interface UtilLibGeneratorSchema {\n  name: string;\n  directory: string;\n}`
    );

    tree.write(
      'workspace.json',
      JSON.stringify({
        projects: {
          proj1: { tags: ['scope:scope1'] },
          proj2: { tags: ['scope:scope2'] },
        },
      })
    );

    await updateScopeSchemaGenerator(tree, options);

    const updatedContent = tree.read(`${base}/schema.d.ts`)?.toString();
    expect(updatedContent).toContain(`directory: 'scope1' | 'scope2';`);
  });

  it('should update schema.json with new scopes', async () => {
    const base = 'libs/internal-plugin/src/generators/util-lib';
    tree.write(
      `${base}/schema.json`,
      JSON.stringify({
        properties: {
          directory: {
            type: 'string',
            enum: [],
          },
        },
      })
    );

    tree.write(
      'workspace.json',
      JSON.stringify({
        projects: {
          proj1: { tags: ['scope:scope1'] },
          proj2: { tags: ['scope:scope2'] },
        },
      })
    );

    await updateScopeSchemaGenerator(tree, options);

    const updatedJson = JSON.parse(
      tree.read(`${base}/schema.json`)?.toString() || '{}'
    );
    expect(updatedJson.properties.directory.enum).toEqual(['scope1', 'scope2']);
  });

  it('should handle projects without scope tags', async () => {
    const base = 'libs/internal-plugin/src/generators/util-lib';
    tree.write(
      `${base}/schema.d.ts`,
      `interface UtilLibGeneratorSchema {\n  name: string;\n  directory: string;\n}`
    );
    tree.write(
      `${base}/schema.json`,
      JSON.stringify({
        properties: {
          directory: {
            type: 'string',
            enum: [],
          },
        },
      })
    );

    tree.write(
      'workspace.json',
      JSON.stringify({
        projects: {
          proj1: { tags: [] },
          proj2: { tags: [] },
        },
      })
    );

    await updateScopeSchemaGenerator(tree, options);

    const updatedContent = tree.read(`${base}/schema.d.ts`)?.toString();
    expect(updatedContent).toContain(`directory: ;`);

    const updatedJson = JSON.parse(
      tree.read(`${base}/schema.json`)?.toString() || '{}'
    );
    expect(updatedJson.properties.directory.enum).toEqual([]);
  });
});
