import { ICommandRegistry, IPivotRegistry, OnePluginHooks } from '@one/plugin';
import { build } from '@one/webpack-bundler';
import { filter } from 'lodash';
import path from 'path';

import { BuildInlineOptions, BuildUnitProvider } from './options.interface';
import { StaffProviderListSchema } from './options.schema';

const BatchBuildCommand: OnePluginHooks = {
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
        name: 's-build',
        description: 'yet, bundle multiple designable material',
      })
      .defineBehavior((command) => {
        command.option('-f, --filter <filter>', 'selective task scheduler');
      })
      .defineAction((injection) => async (command) => {
        // 构建核心环境变量，TODO
        process.env.NODE_ENV = 'production';

        // 配置读取
        const options: BuildInlineOptions = command.opts();
        // monorepo 项目根目录
        const root = injection.config('root');
        const providers = injection.config<BuildUnitProvider[]>('provider');
        const tasks = options.filter ? filter(providers, ['directory', options.filter]) : providers;

        for (const task of tasks) {
          await build({
            root,
            publicPath: task.publicPath,
            // 子项目根目录
            cwd: path.resolve(root, task.workspace, task.directory),
          });
        }
      });
  },
};

export default BatchBuildCommand;
