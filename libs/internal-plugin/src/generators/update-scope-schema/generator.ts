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

  const base = 'libs/internal-plugin/src/generators/util-lib';

  const content = tree.read(`${base}/schema.d.ts`)?.toString();
  const newContent = replaceScope(content, scopes);
  tree.write(`${base}/schema.d.ts`, newContent);

  updateJson(tree, `${base}/schema.json`, (json) => {
    json.properties.directory.enum = Array.from(scopes);
    return json;
  });

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

function replaceScope(content: string, scopes: Set<string>) {
  const joinScopes = Array.from(scopes)
    .map((s) => `'${s}'`)
    .join(' | ');
  console.log('joinScopes:', joinScopes);
  const PATTERN = /interface UtilLibGeneratorSchema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface UtilLibGeneratorSchema {
  name: string;
  directory: ${joinScopes};
}`
  );
}
