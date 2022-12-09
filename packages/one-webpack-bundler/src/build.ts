import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';
import { isArray } from 'lodash';

import { WebpackBuildOptions, WebpackBuildOptionsToken } from './BuildOptions';
import { WebpackBundler } from './WebpackBundler';
import { WebpackBundlerConfig } from './WebpackBundlerConfig';
import { WebpackBundlerInjection } from './WebpackBundlerInjection';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
import { DesignablePalettePlugin } from './plugins/DesignablePalettePlugin';
import { MomentSmoothPlugin } from './plugins/MomentSmoothPlugin';
import { ProgressSmoothPlugin } from './plugins/ProgressSmoothPlugin';
import { ScriptRulePlugin } from './plugins/ScriptRulePlugin';
import { StylesheetPlugin } from './plugins/StylesheetPlugin';

export async function build(options: WebpackBuildOptions) {
  const injector = ReflectiveInjector.resolveAndCreate([
    {
      provide: WebpackBuildOptionsToken,
      useValue: options,
    },
    WebpackBundler,
    WebpackBundlerConfig,
    WebpackBundlerInjection,
  ]);
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
