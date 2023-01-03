import { Injectable } from 'injection-js';

import { OnePlatform } from './OnePlatform';
import { OnePluginCore } from './plugins/core';

/**
 * 命令行注册中心，标准单例模式
 */
@Injectable()
export class CommandLoader {
  constructor(private readonly platform: OnePlatform) {}

  /**
   * 加载配置插件
   * TODO - 插件体系设计尚未完善，插件配置暂不生效，使用全量预加载模式
   */
  async scan() {
    /**
     * 核心内建插件优先
     */
    OnePluginCore(this.platform);
    /**
     * 可配置插件
     */
    const plugins: string[] = this.platform.consumeConfig('plugins');

    for (const name of plugins) {
      await require(name).default(this.platform);
    }
  }
}
