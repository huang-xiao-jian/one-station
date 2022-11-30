import Joi from 'joi';
import path from 'path';
import { OnePluginHooks, IConfigRegistry } from '@one/plugin';

export class OneCommandCore implements OnePluginHooks {
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
  }
}
