import { isArray } from 'lodash';

import { collectPlugins } from './collector';
import { createInjector } from './injector';
import { WebpackBuildOptions } from './internal/BuildOptions';
import { WebpackBundler } from './internal/WebpackBundler';

export async function config(options: WebpackBuildOptions) {
  const injector = createInjector(options);
  const bundler: WebpackBundler = injector.get(WebpackBundler);
  const plugins = collectPlugins();

  // 预设插件
  bundler.provide(plugins);
  // 入参插件优先级更高，调用顺序靠后
  bundler.provide(isArray(options.plugins) ? options.plugins : []);

  await bundler.warmUp();

  return bundler.toConfig();
}
