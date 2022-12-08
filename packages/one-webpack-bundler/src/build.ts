import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { WebpackBuildOptions, WebpackBuildOptionsToken } from './BuildOptions';
import { WebpackBundler } from './WebpackBundler';
import { WebpackBundlerConfig } from './WebpackBundlerConfig';
import { WebpackBundlerInjection } from './WebpackBundlerInjection';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
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

  await bundler.warmUp([
    new BrowserBaselinePlugin(),
    new ScriptRulePlugin(),
    new StylesheetPlugin(),
    new AssetRulePlugin(),
    new BundleAnalyzePlugin(),
  ]);
  await bundler.bundle();
}
