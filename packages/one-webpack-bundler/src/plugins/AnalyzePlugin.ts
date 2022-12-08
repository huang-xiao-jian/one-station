/**
 * 静态资源处理
 */
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

import { WebpackBundler } from '../WebpackBundler';
import { WebpackBundlerPlugin } from '../WebpackBundlerPlugin';

export class BundleAnalyzePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('BundleAnalyzePlugin', async (wbc, wbs) => {
      wbc.hooks.initialize.tapPromise('BundleAnalyzePluginInitialize', async (chain) => {
        const injection = wbs.request('injection');
        const environment = injection.env<string>('ANALYZE');

        // 环境变量默认为字符串类型
        if (environment === 'true') {
          chain.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin, [
            // https://github.com/webpack-contrib/webpack-bundle-analyzer
            {
              analyzerMode: 'static',
              openAnalyzer: false,
              logLevel: 'info',
              defaultSizes: 'parsed',
            },
          ]);
        }
      });
    });
  }
}
