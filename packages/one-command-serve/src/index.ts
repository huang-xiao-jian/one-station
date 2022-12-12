import { ICommandRegistry, IPivotRegistry, OnePluginHooks } from '@one/plugin';
import { serve } from '@one/webpack-bundler';

import { CommandServeOptions, CommandServeOptionsSchema } from './options';

const SingletonCommandServe: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'serve',
      schema: CommandServeOptionsSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'st-serve',
        description: 'yet, serve single designable material',
      })
      .referenceConfig(['serve'])
      .defineBehavior((command) => {
        // TODO
      })
      .defineAction((injection) => async (command) => {
        // 构建核心环境变量，TODO
        process.env.NODE_ENV = 'development';

        // 配置读取
        const root = injection.config('root');
        const options = injection.config<CommandServeOptions>('serve');

        await serve({
          root,
          cwd: process.cwd(),
          publicPath: options.publicPath,
        });
      });
  },
};

export default SingletonCommandServe;
