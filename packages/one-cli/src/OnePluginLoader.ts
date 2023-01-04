import { Injectable } from 'injection-js';
import Joi from 'joi';

import { OnePlatform } from './OnePlatform';

/**
 * 命令行注册中心，标准单例模式
 */
@Injectable()
export class OnePluginLoader {
  constructor(private readonly platform: OnePlatform) {
    const internals = [require.resolve('./plugins/core')];
    /**
     * 必须提供插件配置
     */
    platform.registerConfig({
      key: 'plugins',
      schema: Joi.array().items(Joi.string()).required(),
      transform(material) {
        const original: string[] = material.value;
        const plugins = [
          // 内部插件执行顺序优先
          ...internals,
          // 用户配置插件顺序靠后
          ...original,
        ];

        return plugins;
      },
    });
  }

  async scan() {
    /**
     * 可配置插件
     */
    const plugins: string[] = this.platform.consumeConfig('plugins');

    for (const name of plugins) {
      await require(name).default(this.platform);
    }
  }
}
