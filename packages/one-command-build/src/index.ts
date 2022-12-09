import { ICommandRegistry, IPivotRegistry, OnePluginHooks } from '@one/plugin';
import { build } from '@one/webpack-bundler';
import Joi from 'joi';

const SingletonCommandBuild: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'publicPath',
      schema: Joi.string(),
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'st-build',
        description: 'yet, bundle single designable material',
      })
      .referenceConfig(['publicPath'])
      .defineBehavior((command) => {
        // TODO
      })
      .defineAction((injection) => async (command) => {
        // 构建核心环境变量，TODO
        process.env.NODE_ENV = 'production';

        // 配置读取
        const root = injection.config('root');
        const publicPath = injection.config('publicPath');

        await build({
          root,
          publicPath,
          cwd: process.cwd(),
        });
      });
  },
};

export default SingletonCommandBuild;
