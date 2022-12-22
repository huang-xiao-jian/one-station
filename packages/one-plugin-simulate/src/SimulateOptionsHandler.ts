import type { OnePluginApi } from '@one/plugin';
import { Injectable } from 'injection-js';
import { toNumber } from 'lodash';
import { getPortPromise } from 'portfinder';

import { InlineSimulateOptions, SimulateOptions, URLRewriteRule } from './options';

export class SimulateOptionsHandler {
  constructor(private readonly api: OnePluginApi) {}

  /**
   * 预备服务端参数
   */
  async handle(inlineOptions: InlineSimulateOptions): Promise<SimulateOptions> {
    const outDir: string = this.api.consumeConfig('outDir');
    const rewriteRules: URLRewriteRule[] = this.api.consumeConfig('simulate.rewrites');
    const port = inlineOptions.port
      ? toNumber(inlineOptions.port)
      : await getPortPromise({
          port: 3600,
          stopPort: 3900,
        });

    return {
      rootDir: outDir,
      protocol: 'http',
      host: '0.0.0.0',
      port,
      rewriteRules,
      cors: inlineOptions.cors,
      mock: inlineOptions.mock,
      proxy: inlineOptions.proxy,
      historyApiFallback: inlineOptions.historyApiFallback,
    };
  }
}
