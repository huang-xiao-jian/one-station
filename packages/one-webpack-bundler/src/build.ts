import 'reflect-metadata';

import { isArray } from 'lodash';
import webpack, { Stats } from 'webpack';

import { createInjector } from './injector';
import { WebpackBuildOptions } from './internal/BuildOptions';
import { WebpackBundler } from './internal/WebpackBundler';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
import { MomentSmoothPlugin } from './plugins/MomentSmoothPlugin';
import { ProgressSmoothPlugin } from './plugins/ProgressSmoothPlugin';
import { ScriptRulePlugin } from './plugins/ScriptRulePlugin';
import { StylesheetPlugin } from './plugins/StylesheetPlugin';

export async function build(options: WebpackBuildOptions) {
  const injector = createInjector(options);
  const bundler: WebpackBundler = injector.get(WebpackBundler);

  // 生产构建模式预设插件
  bundler.provide([
    new BrowserBaselinePlugin(),
    new ScriptRulePlugin(),
    new StylesheetPlugin(),
    new AssetRulePlugin(),
    new BundleAnalyzePlugin(),
    new MomentSmoothPlugin(),
    new ProgressSmoothPlugin(),
  ]);
  // 入参插件优先级更高，调用顺序靠后
  bundler.provide(isArray(options.plugins) ? options.plugins : []);

  // 插件实际调用
  await bundler.warmUp();

  const config = await bundler.toConfig();
  const compiler = webpack(config);

  // 插件实际调用
  await bundler.warmUp();

  if (options.watch) {
    compiler.watch(config.watchOptions || {}, (err, stats) => {
      console.log(stats?.toString('normal'));
    });
  } else {
    compiler.run((err, stats) => {
      /**
       * 实例化阶段错误抛出，webpack 自身不抛出错误单独处理
       */
      if (err) {
        throw new Error('[WebpackBundler] build exception');
      } else {
        console.log(stats?.toString('normal'));

        if (stats?.hasErrors()) {
          throw new Error('[WebpackBundler] build exception');
        }
      }

      compiler.close(() => {
        // nothing todo
      });
    });
  }
}
