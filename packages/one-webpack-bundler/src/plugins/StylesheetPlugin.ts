/**
 * 静态资源处理
 */
import { isNil } from 'lodash';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

/**
 * 裁剪入参，仅包含优先可调参数
 */
interface LessConfiguration {
  /** Defines a variable that can be referenced by the file. */
  globalVars?: Record<string, string>;
  /** Puts Var declaration at the end of base file. */
  modifyVars?: Record<string, string>;
  /** If true, enable evaluation of JavaScript inline in `.less` files. */
  javascriptEnabled?: boolean;
}

export class StylesheetPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('StylesheetPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('StylesheetPluginInitialize', async (chain) => {
        const css = chain.module.rule('css').test(/\.css(\?.*)?$/);
        const lessrc = await wbi.configFile<LessConfiguration>('less');

        css.use('MiniCSSExtractPlugin').loader(MiniCSSExtractPlugin.loader);
        css
          .use('css-loader')
          .loader(require.resolve('css-loader'))
          .options({
            modules: {
              localIdentName: '[local]__[hash:base64:5]',
            },
          });

        const less = chain.module.rule('less').test(/\.less(\?.*)?$/);

        less.use('MiniCSSExtractPlugin').loader(MiniCSSExtractPlugin.loader);
        less
          .use('css-loader')
          .loader(require.resolve('css-loader'))
          .options({
            modules: {
              localIdentName: '[local]__[hash:base64:5]',
            },
          });
        less
          .use('less-loader')
          .loader(require.resolve('less-loader'))
          .options({
            implementation: require.resolve('less'),
            lessOptions: {
              /**
               * 配置文件优先级高，默认为激活
               */
              javascriptEnabled: isNil(lessrc.javascriptEnabled) ? true : lessrc.javascriptEnabled,
              modifyVars: lessrc.modifyVars,
              globalVars: lessrc.globalVars,
            },
          });

        const sass = chain.module.rule('sass').test(/\.(sass|scss)(\?.*)?$/);

        sass.use('MiniCSSExtractPlugin').loader(MiniCSSExtractPlugin.loader);
        sass
          .use('css-loader')
          .loader(require.resolve('css-loader'))
          .options({
            modules: {
              localIdentName: '[local]__[hash:base64:5]',
              // 纯复制操作，实际原因不明
              // @ts-ignore
              getLocalIdent(loaderContext, localIdentName, localName, options) {
                if (loaderContext.resourcePath.includes('theme')) {
                  return localName;
                }
              },
            },
          });
        sass.use('sass-loader').loader(require.resolve('sass-loader'));

        chain.plugin('mini-css-extract-plugin').use(MiniCSSExtractPlugin, [
          {
            filename: 'static/[contenthash].css',
            chunkFilename: 'static/[contenthash].css',
            ignoreOrder: true,
          },
        ]);
      });
    });
  }
}
