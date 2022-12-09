/**
 * TODO - 构建缓存
 */
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class ServeSmoothPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('ServeSmoothPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('ServeSmoothPlugin', async (chain) => {
        const environment = wbi.env<string>('NODE_ENV');

        // 环境变量默认为字符串类型
        chain.when(environment !== 'production', (chain) => {
          chain.devServer.port(3061).hot(true).headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
          });

          chain.devServer.set('client', {
            overlay: {
              errors: true,
              warnings: false,
            },
          });

          chain.plugin('ReactRefreshWebpackPlugin').use(ReactRefreshWebpackPlugin, [
            {
              overlay: false,
            },
          ]);
        });
      });
    });
  }
}
