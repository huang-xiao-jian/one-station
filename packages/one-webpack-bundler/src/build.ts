import 'reflect-metadata';

import { isArray } from 'lodash';

import { createInjector } from './injector';
import { WebpackBuildOptions } from './internal/BuildOptions';
import { WebpackBundler } from './internal/WebpackBundler';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
import { DesignablePalettePlugin } from './plugins/DesignablePalettePlugin';
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
    new DesignablePalettePlugin(),
  ]);
  // 入参插件优先级更高，调用顺序靠后
  bundler.provide(isArray(options.plugins) ? options.plugins : []);

  await bundler.warmUp();

  const stats = await bundler.bundle();

  if (stats?.hasErrors()) {
    console.log(stats?.toJson('errors-only'));

    throw new Error('[WebpackBundler] build exception');
  } else {
    console.log(stats?.toString('normal'));
  }
}
