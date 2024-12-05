import { PromiseExecutor } from '@nx/devkit';
import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

const runExecutor: PromiseExecutor<FlyDeployExecutorSchema> = async (
  options
) => {
  const name = options.flyAppName;
  const list = execSync('fly apps list');

  const appExists = list.includes(name);
  const cwd = options.distLocation;

  try {
    if (!appExists) {
      execSync(`fly launch --now --name=${name} --region=lax --yes`, {
        cwd,
        stdio: 'inherit',
      });
    } else {
      execSync(`fly deploy`, { cwd, stdio: 'inherit' });
    }
    return {
      success: true,
    };
  } catch (e) {
    return { success: false };
  }
};

export default runExecutor;
