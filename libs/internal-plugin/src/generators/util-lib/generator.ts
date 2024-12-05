import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import * as path from 'path';
import { UtilLibGeneratorSchema } from './schema';

export async function utilLibGenerator(
  tree: Tree,
  options: UtilLibGeneratorSchema
) {
  const preFix = 'util-';
  const directory = options.directory || options.name;
  console.log('The name is: ', `${preFix}${options.name}`);
  console.log('The directory is', options.directory);
  await libraryGenerator(tree, {
    directory: `${directory}/${preFix}${options.name}`,
    tags: `type:util, scope:${directory}`,
  });
  await formatFiles(tree);
}

export default utilLibGenerator;
