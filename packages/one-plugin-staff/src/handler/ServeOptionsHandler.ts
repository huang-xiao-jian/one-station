import type { OnePluginApi } from '@one/plugin';
import { WebpackBuildOptions, WebpackBundlerPlugin } from '@one/webpack-bundler';

import { InlineOptions } from '../options';
import { DesignablePalettePlugin } from '../plugins/DesignablePalettePlugin';

export class ServeOptionsHandler {
  constructor(private readonly api: OnePluginApi) {}

  /**
   * 预备服务端参数
   */
  async handle(inlineOptions: InlineOptions): Promise<WebpackBuildOptions> {
    // 配置读取
    const root: string = this.api.consumeConfig('root');
    const plugins: WebpackBundlerPlugin[] = [
      /**
       * 模块联邦
       */
      new DesignablePalettePlugin(),
    ];

    return {
      root,
      publicPath: '.',
      plugins,
      cwd: process.cwd(),
    };
  }
}
