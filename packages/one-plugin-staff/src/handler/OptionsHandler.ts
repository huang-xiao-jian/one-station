import type { OnePluginApi } from '@one/plugin';
import { WebpackBundlerPlugin } from '@one/webpack-bundler';

import { InlineOptions, ResolvedOptions } from '../options';
import { DesignablePalettePlugin } from '../plugins/DesignablePalettePlugin';
import { WatchOptimizePlugin } from '../plugins/WatchOptimizePlugin';

export class BuildOptionsHandler {
  constructor(private readonly api: OnePluginApi) {}

  /**
   * 预备服务端参数
   */
  async handle(inlineOptions: InlineOptions): Promise<ResolvedOptions> {
    // 配置读取
    const root: string = this.api.consumeConfig('root');
    const publicPath: string = this.api.consumeConfig('publicPath');
    // 参数派生
    const watch = !!inlineOptions.watch;
    const plugins: WebpackBundlerPlugin[] = [
      /**
       * 模块联邦
       */
      new DesignablePalettePlugin(),
    ];

    // 适配持续构建模式
    if (watch) {
      plugins.push(new WatchOptimizePlugin());
    }

    return {
      watch,
      root,
      publicPath,
      plugins,
      cwd: process.cwd(),
    };
  }
}
