import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  console.log('Updating scope schema...');
  console.log('options:', options);
  const projectMap = getProjects(tree);
  const scopes = getScopes(projectMap);
  console.log('scopes:', scopes);

  updateJson(
    tree,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (json) => {
      json.properties.directory.enum = Array.from(scopes);
      return json;
    }
  );

  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const scopes = new Set<string>();
  projectMap.forEach((project) => {
    const tags = project.tags;
    if (tags && tags.length > 0) {
      tags
        .filter((tag) => tag.startsWith('scope'))
        .map((scope) => scope.replace('scope:', ''))
        .forEach((tag) => scopes.add(tag));
    }
  });
  return scopes;
}
