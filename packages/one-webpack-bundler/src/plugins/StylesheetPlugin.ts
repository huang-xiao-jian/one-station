/**
 * 静态资源处理
 */

import { isNil } from 'lodash';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import { WebpackBundler } from '../WebpackBundler';
import { WebpackBundlerPlugin } from '../WebpackBundlerPlugin';

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
    bundler.hooks.blueprint.tapPromise('StylesheetPlugin', async (wbc, wbs) => {
      wbc.hooks.initialize.tapPromise('StylesheetPluginInitialize', async (chain) => {
        const injection = wbs.request('injection');
        const css = chain.module.rule('css').test(/\.css(\?.*)?$/);
        const lessrc = await injection.configFile<LessConfiguration>('less');

        css.use(MiniCSSExtractPlugin.loader);
        css.use('css-loader').options({
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
        });

        const less = chain.module.rule('less').test(/\.less(\?.*)?$/);

        less.use(MiniCSSExtractPlugin.loader);
        less.use('css-loader').options({
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
        });
        less.use('less-loader').options({
          lessOptions: {
            /**
             * 配置文件优先级高，默认为激活
             */
            javascriptEnabled: isNil(lessrc.javascriptEnabled) ? true : lessrc.javascriptEnabled,
            modifyVars: lessrc.modifyVars,
            globalVars: lessrc.globalVars,
          },
        });

        const sass = chain.module.rule('less').test(/\.(sass|scss)(\?.*)?$/);

        sass.use(MiniCSSExtractPlugin.loader);
        sass.use('css-loader').options({
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
        sass.use('sass-loader');

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
