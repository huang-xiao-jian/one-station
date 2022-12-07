/**
 * 静态资源处理
 */
import { WebpackBundler } from '../WebpackBundler';
import { WebpackBundlerPlugin } from '../WebpackBundlerPlugin';

export class ScriptRulePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('BaselinePlugin', async (wbc, wbs) => {
      wbc.hooks.initialize.tapPromise('BaselinePluginConfigInitialize', async (chain) => {
        const injection = wbs.request('injection');
        const environment = injection.env<string>('NODE_ENV');

        chain.module
          .rule('script')
          .test(/\.(t|j)sx?$/)
          .exclude.add(/node_modules/)
          .end()
          .use('swc-loader')
          .options({
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic',
                  refresh: environment !== 'production',
                },
              },
            },
          });
      });
    });
  }
}
