/**
 * 静态资源处理
 */
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class BundleAnalyzePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('BundleAnalyzePlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('BundleAnalyzePluginInitialize', async (chain) => {
        const environment = wbi.env<string>('ANALYZE');

        // 环境变量默认为字符串类型
        chain.when(environment === 'true', (chain) => {
          chain.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin, [
            // https://github.com/webpack-contrib/webpack-bundle-analyzer
            {
              analyzerMode: 'static',
              openAnalyzer: false,
              logLevel: 'info',
              defaultSizes: 'parsed',
            },
          ]);
        });
      });
    });
  }
}
