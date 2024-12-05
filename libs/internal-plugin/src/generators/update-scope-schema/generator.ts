import { formatFiles, Tree, updateJson } from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  console.log('Updating scope schema...');
  console.log('options:', options);
  updateJson(tree, 'nx.json', (json) => ({
    ...json,
    defaultProject: 'movies-app',
  }));
  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;
