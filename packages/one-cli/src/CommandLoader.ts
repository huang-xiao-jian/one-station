import OnePluginAssemble from '@one/plugin-assemble';
import OnePluginBuild from '@one/plugin-build';
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
     * 标准化模板代码
     *
     * 特别说明：
     *   内部插件执行顺序靠前
     */
    OnePluginCore(this.platform);
    OnePluginAssemble(this.platform);
    OnePluginBuild(this.platform);
  }
}
