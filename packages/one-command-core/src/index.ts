import Joi from 'joi';
import path from 'path';
import { OnePluginHooks, IConfigRegistry } from '@one/plugin';

const OneCommandCore: OnePluginHooks = {
  onConfigInit(hooks: IConfigRegistry) {
    /**
     * 推荐设置为项目根目录
     */
    hooks.registerConfig({
      key: 'root',
      schema: Joi.string(),
      default: process.cwd(),
    });

    /**
     * 输出目录，独立项目、monorepo 相同逻辑
     */
    hooks.registerConfig({
      key: 'outDir',
      schema: Joi.string(),
      default: path.join(process.cwd(), 'dist'),
    });

    /**
     * 核心环境变量，回收内部插件处理
     */
    hooks.registerEnvironmentVariable({
      name: 'NODE_ENV',
      description: 'yet, convenient way for adjust internal behavior',
      default: 'development',
    });
  },
};

export default OneCommandCore;
