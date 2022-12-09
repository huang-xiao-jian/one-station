import { ReflectiveInjector } from 'injection-js';

import { WebpackBuildOptions, WebpackBuildOptionsToken } from './BuildOptions';
import { WebpackBundler } from './WebpackBundler';
import { WebpackBundlerConfig } from './WebpackBundlerConfig';
import { WebpackBundlerInjection } from './WebpackBundlerInjection';

export function createInjector(options: WebpackBuildOptions): ReflectiveInjector {
  const injector = ReflectiveInjector.resolveAndCreate([
    {
      provide: WebpackBuildOptionsToken,
      useValue: options,
    },
    WebpackBundler,
    WebpackBundlerConfig,
    WebpackBundlerInjection,
  ]);

  return injector;
}
