import type { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class ScriptRulePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('ScriptRulePlugin', async (wbc, wbi, axis) => {
      wbc.hooks.initialize.tapPromise('ScriptRulePluginInitialize', async (chain) => {
        const cacheDirectory = await axis.request('babel-loader');
        const script = chain.module.rule('script').test(/\.(t|j)sx?$/);

        script.exclude.add(/node_modules/);
        script
          .use('babel-loader')
          .loader(require.resolve('babel-loader'))
          .options({
            cacheCompression: false,
            cacheDirectory,
            babelrc: false,
            presets: [
              [require.resolve('@babel/preset-env'), { loose: true }],
              [
                require.resolve('@babel/preset-react'),
                {
                  runtime: 'automatic',
                },
              ],
              [require.resolve('@babel/preset-typescript')],
            ],
          });
      });
    });
  }
}
