import { WebpackBuildOptions, serve } from '@one/webpack-bundler';

export class ServeHandler {
  /**
   * 预备服务端参数
   */
  async handle(options: WebpackBuildOptions) {
    await serve(options);
  }
}
