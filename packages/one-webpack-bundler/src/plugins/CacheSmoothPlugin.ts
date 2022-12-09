/**
 * TODO - 构建缓存
 */
import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class CacheSmoothPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('CacheSmoothPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('CacheSmoothPlugin', async (chain) => {
        const environment = wbi.env<string>('NODE_ENV');

        // 环境变量默认为字符串类型
        chain.when(environment === 'production', (chain) => {
          chain.cache({
            type: 'filesystem',
            buildDependencies: {
              config: [],
            },
          });
        });
      });
    });
  }
}
