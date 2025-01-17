/// <reference types="../../one-plugin-assemble" />
import 'reflect-metadata';

import { createOnePlugin } from '@one/plugin-runner';
import { toNumber } from 'lodash';

import { SimulateHandler } from './SimulateHandler';
import { SimulateOptionsHandler } from './SimulateOptionsHandler';
import { InlineSimulateOptions } from './options';
import { URLRewriteRuleSchema } from './schema';

export default createOnePlugin((api) => {
  /**
   * 注册参数
   */
  api.registerConfig({
    key: 'simulate.rewrites',
    default: [],
    schema: URLRewriteRuleSchema,
  });

  /**
   * 注册核心指令
   */
  api
    .registerCommand({
      name: 'simulate',
      description: 'yet, simulate local artifact',
    })
    .referenceConfig(['ourDir'])
    .defineBehavior((command) => {
      command
        .option('-p, --port <port>', 'server listening port', (raw) => toNumber(raw))
        .option('--no-cors', 'disabled cors functionality')
        .option('--no-proxy', 'disabled automatic API proxy')
        .option('--no-mock', 'disable automatic API mockery')
        .option('--no-history-api-fallback', 'disabled browser history route support');
    })
    .defineAction(async (command) => {
      /**
       * 命令行标准处理流程：
       *   - 参数预处理
       *   - 工作环境预热
       *   - 功能执行
       */

      // 参数预处理
      const inlineOptions: InlineSimulateOptions = command.opts();
      const receiver = new SimulateOptionsHandler(api);
      const options = await receiver.handle(inlineOptions);

      // 工作环境预热
      await api.consumeHandler('assemble:once', [
        {
          clean: true,
          watch: true,
        },
      ]);

      // 功能执行
      const simulator = new SimulateHandler(api);

      // 终极一战
      simulator.serve(options);
    });
});
