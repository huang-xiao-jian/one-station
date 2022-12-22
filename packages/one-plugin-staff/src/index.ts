import { createOnePlugin } from '@one/plugin-runner';
import Joi from 'joi';

import { BuildHandler } from './handler/Handler';
import { BuildOptionsHandler } from './handler/OptionsHandler';
import { InlineOptions } from './options';

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
      command.option('-w, --watch', 'build in continuous mode');
    })
    .defineAction(async (command) => {
      // 环境变量设置
      process.env.NODE_ENV = 'production';

      const inlineOptions: InlineOptions = command.opts();
      const buildOptionsHandler = new BuildOptionsHandler(api);
      const config = await buildOptionsHandler.handle(inlineOptions);
      const buildHandler = new BuildHandler();

      await buildHandler.handle(config);
    });
});
