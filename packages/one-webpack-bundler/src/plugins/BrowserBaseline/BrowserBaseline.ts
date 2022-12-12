/**
 * 浏览器应用构建基准配置
 */
import type { Maybe } from '@one/experiment-support';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import path from 'path';

import { WebpackBundler } from '../../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../../internal/WebpackBundlerPlugin';
import { BrowserBaselineDevelopmentOptimizeHandler } from './DevelopmentOptimizeHandler';
import { BrowserBaselineProductionOptimizeHandler } from './ProductionOptimizeHandler';

/**
 * 浏览器环境构建模式
 */
export class BrowserBaselinePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('BaselinePlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('BaselinePluginConfigInitialize', async (chain) => {
        const environment = wbi.env<Maybe<string>>('NODE_ENV');
        const cwd = wbi.config<string>('cwd');
        const publicPath = wbi.config<string>('publicPath');
        // 构建模式默认开发模式
        const mode = environment === 'production' ? 'production' : 'development';

        /**
         * webpack chain 相对路径存在问题，约定为 cwd 路径作为基准，暂时不可修改
         */
        chain.context(cwd);
        /**
         * 默认入口文件，暂不允许修改
         */
        chain.entry('main').add(path.resolve(cwd, './src/index.ts'));
        /**
         * 生产构建模式关闭 sourcemap，不存在解析功能，开启浪费
         */
        chain.when(
          mode === 'development',
          (chain) => {
            chain.devtool('cheap-module-source-map');
          },
          (chain) => {
            chain.devtool(false);
          },
        );
        /**
         * 仅支持 web 构建模式，简化配置
         */
        chain.mode(mode).target('web');
        /**
         * 默认关闭 amd 风格支持
         */
        chain.set('amd', false);

        /**
         * 关闭 node 兼容
         */
        chain.node.set('global', false).set('__filename', false).set('__dirname', false);

        /**
         * 输出文件模式统一
         * TODO - 差异点在于 publicPath / outDir，由外部传入
         */
        chain.output
          .path(path.resolve(cwd, './dist'))
          .publicPath(publicPath)
          .filename('static/[contenthash].js')
          .chunkFilename('static/[contenthash].js')
          /**
           * TODO - 目测影响代码生成模板
           *
           * @link - https://webpack.js.org/configuration/output/#outputenvironment
           */
          .set('assetModuleFilename', 'static/[contenthash].[ext]');

        /**
         * 文件定位配置 TODO - alias
         */
        // prettier-ignore
        chain.resolve
          // 软连接激活
          .set('symlinks', true)
          .modules.add('node_modules').end()
          // 扩展名补全严格限制，避免失控
          .extensions.merge(['.tsx', '.ts', '.jsx', '.js']).end()
          .alias.set('@', path.resolve(cwd, './src')).end();

        /**
         * 压缩关联配置
         */
        const optimizer =
          mode === 'development'
            ? new BrowserBaselineDevelopmentOptimizeHandler()
            : new BrowserBaselineProductionOptimizeHandler();
        optimizer.handle(chain, wbi);

        /**
         * 基准插件配置
         */
        chain.plugin('CaseSensitivePathsPlugin').use(CaseSensitivePathsPlugin);
      });
    });
  }
}
