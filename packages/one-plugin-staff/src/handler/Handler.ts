import { build } from '@one/webpack-bundler';

import { ResolvedOptions } from '../options';

export class BuildHandler {
  /**
   * 预备服务端参数
   */
  async handle(options: ResolvedOptions) {
    await build(options);
  }
}
