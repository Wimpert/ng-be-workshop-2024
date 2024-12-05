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
  console.log('The name is: ', options.name);
  await libraryGenerator(tree, { directory: `${preFix}${options.name}` });
  await formatFiles(tree);
}

export default utilLibGenerator;
