import { isArray } from 'lodash';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { createInjector } from './injector';
import { WebpackBuildOptions } from './internal/BuildOptions';
import { WebpackBundler } from './internal/WebpackBundler';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
import { MomentSmoothPlugin } from './plugins/MomentSmoothPlugin';
import { ProgressSmoothPlugin } from './plugins/ProgressSmoothPlugin';
import { ScriptRulePlugin } from './plugins/ScriptRulePlugin';
import { ServeSmoothPlugin } from './plugins/ServeSmoothPlugin';
import { StylesheetPlugin } from './plugins/StylesheetPlugin';

/**
 * 开发模式配置
 */
export async function serve(options: WebpackBuildOptions) {
  const injector = createInjector(options);
  const bundler: WebpackBundler = injector.get(WebpackBundler);

  // 预设插件
  bundler.provide([
    new BrowserBaselinePlugin(),
    new ScriptRulePlugin(),
    new StylesheetPlugin(),
    new AssetRulePlugin(),
    new BundleAnalyzePlugin(),
    new MomentSmoothPlugin(),
    new ProgressSmoothPlugin(),
    new ServeSmoothPlugin(),
  ]);
  // 入参插件优先级更高，调用顺序靠后
  bundler.provide(isArray(options.plugins) ? options.plugins : []);

  // 插件实际调用
  await bundler.warmUp();
  /**
   * 开发模式服务器
   */
  // 配置文件读取
  const config = await bundler.toConfig();
  const compiler = webpack(config);

  // 开发服务器启动
  const server = new WebpackDevServer(
    {
      ...config.devServer,
    },
    compiler,
  );

  // 暂定不掺杂任何冗余操作
  await server.start();
}
