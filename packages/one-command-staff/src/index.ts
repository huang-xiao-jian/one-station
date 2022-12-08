import { ICommandRegistry, IPivotRegistry, OnePluginHooks } from '@one/plugin';
import { build } from '@one/webpack-bundler';

import { StaffProviderListSchema } from './options.schema';

const CommandStaffToolkit: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'provider',
      schema: StaffProviderListSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'st-bundle',
        description: 'yet, bundle designable material',
      })
      .referenceConfig('provider')
      .defineBehavior((command) => {
        command.option('-d, --dry-run [dry]', 'whether working on file system');
      })
      .defineAction((injection) => async (command) => {
        console.log({
          root: injection.config('root'),
        });
        await build({
          root: injection.config('root'),
          cwd: process.cwd(),
          publicPath: '/',
        });
      });
  },
};

export default CommandStaffToolkit;
