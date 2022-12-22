import { WebpackBundler, WebpackBundlerPlugin } from '@one/webpack-bundler';

/**
 * 优化持续构建模式
 */
export class WatchOptimizePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('WatchOptimizePlugin', async (wbc, wbi) => {
      wbc.hooks.adjustment.tapPromise('WatchOptimizePluginInitialize', async (chain) => {
        /**
         * 开启持续构建模式，此处仅需要微调参数即可
         */
        /**
         * 关闭代码压缩
         */
        chain.optimization.minimize(false);
        /**
         * 打开 sourcemap 方便源码调试
         */
        chain.devtool('cheap-module-source-map');
      });
    });
  }
}
