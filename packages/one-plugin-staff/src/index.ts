import { createOnePlugin } from '@one/plugin-runner';
import { build } from '@one/webpack-bundler';
import Joi from 'joi';

export default createOnePlugin((api) => {
  /**
   * 注册外部依赖
   */
  api.registerConfig({
    key: 'publicPath',
    schema: Joi.string(),
  });

  /**
   * 注册核心指令
   */
  api
    .registerCommand({
      name: 'st-build',
      description: 'yet, bundle single designable material',
    })
    .referenceConfig(['publicPath'])
    .defineBehavior((command) => {
      // TODO - check useful options
      // command
      //   .option('-w, --watch [watch]', 'assemble in continuous mode')
      //   .option('--no-clean', 'cleanup output directory before assemble');
    })
    .defineAction(async (command) => {
      // 环境变量设置
      process.env.NODE_ENV = 'production';

      // 配置读取
      const root: string = api.consumeConfig('root');
      const publicPath = api.consumeConfig('publicPath');

      await build({
        root,
        publicPath,
        cwd: process.cwd(),
      });
    });
});
