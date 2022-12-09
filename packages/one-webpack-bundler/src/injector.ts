import { ReflectiveInjector } from 'injection-js';

import { WebpackBuildOptions, WebpackBuildOptionsToken } from './internal/BuildOptions';
import { WebpackBundler } from './internal/WebpackBundler';
import { WebpackBundlerConfig } from './internal/WebpackBundlerConfig';
import { WebpackBundlerInjection } from './internal/WebpackBundlerInjection';

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
