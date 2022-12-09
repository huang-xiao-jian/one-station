/**
 * 静态资源处理
 */
import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class AssetRulePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('AssetRulePlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('AssetRulePluginInitialize', async (chain) => {
        const rule = chain.module.rule('asset');

        /**
         * 可预见静态文件类型
         */
        rule
          .oneOf('image')
          .test(/\.(bmp|gif|jpg|jpeg|png|gif|woff2?|eot|ttf|otf)(\?.*)?$/)
          // @ts-ignore
          .type('asset')
          .parser({
            dataUrlCondition: {
              // 10kb
              maxSize: 10 * 1024,
            },
          });

        /**
         * 未预知静态文件类型
         */
        rule
          .oneOf('fallback')
          // @ts-ignore
          .type('asset/resource')
          .exclude.add(/^$/) /* handle data: resources */
          .add(/\.(js|mjs|cjs|jsx|ts|tsx)$/)
          .add(/\.(css|less|sass|scss|stylus)$/)
          .add(/\.html$/)
          .add(/\.json$/);
      });
    });
  }
}
