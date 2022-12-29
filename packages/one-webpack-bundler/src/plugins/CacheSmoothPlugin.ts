import path from 'path';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class CacheSmoothPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('CacheSmoothPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('CacheSmoothPlugin', async (chain) => {
        const cwd = wbi.config<string>('cwd');
        const environment = wbi.env<string>('NODE_ENV');

        // 环境变量默认为字符串类型
        chain.when(environment === 'production', (chain) => {
          chain.cache({
            type: 'filesystem',
            version: require('../../package.json').version,
            /**
             * TODO
             *
             * 1. 理论上来说，缓存目录应该统一管理
             * 2. 生产构建环境下，依赖持久化缓存
             */
            cacheDirectory: path.resolve(cwd, 'node_modules', '.cache', 'one-webpack-bundler'),
            buildDependencies: {
              config: [],
            },
          });
        });
      });
    });
  }
}
