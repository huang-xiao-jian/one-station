import { createOnePlugin } from '@one/plugin-runner';

import { AssembleHandler } from './AssembleHandler';
import { AssembleOptionsHandler } from './AssembleOptionsHandler';
import { ContinuousAssembleHandler } from './ContinuousAssembleHandler';
import { AssembleInlineOptions, AssembleTaskInternal } from './options.interface';
import { AssembleOptionSchema } from './options.schema';

declare global {
  interface OneHandlerMapping {
    'assemble:once': (options: AssembleInlineOptions) => Promise<void>;
    'assemble:watch': (options: AssembleInlineOptions) => Promise<void>;
    'assemble:options': (options: AssembleInlineOptions) => Promise<AssembleTaskInternal[]>;
  }
}

export default createOnePlugin((api) => {
  /**
   * 注册外部依赖
   */
  api.registerConfig({
    key: 'assemble',
    schema: AssembleOptionSchema,
  });

  /**
   * 参数内部处理
   */
  api.registerHandler('assemble:options', async (options) => {
    const handler = new AssembleOptionsHandler(api);
    const tasks = await handler.handle(options);

    return tasks;
  });

  /**
   * 导出核心功能，一次性聚合产物
   */
  api.registerHandler('assemble:once', async (options) => {
    const handler = new AssembleHandler();
    const tasks = await api.consumeHandler('assemble:options', [options]);

    await handler.handle(tasks);
  });

  /**
   * 导出核心功能，持续聚合产物
   */
  api.registerHandler('assemble:watch', async (options) => {
    const handler = new ContinuousAssembleHandler();
    const tasks = await api.consumeHandler('assemble:options', [options]);

    await handler.handle(tasks);
  });

  /**
   * 注册核心指令
   */
  api
    .registerCommand({
      name: 'assemble',
      description: 'yet, assemble plugin to aggregate artifacts',
    })
    .referenceConfig(['root', 'ourDir', 'assemble'])
    .defineBehavior((command) => {
      command
        .option('-w, --watch [watch]', 'assemble in continuous mode')
        .option('--no-clean', 'cleanup output directory before assemble');
    })
    .defineAction(async (command) => {
      /**
       * 命令行标准处理流程：
       *   - 参数预处理（按摩需求收集）
       *   - 工作环境预热（技师准备原材料、房间）
       *   - 功能执行
       */
      const inlineOptions: AssembleInlineOptions = command.opts();

      // 实际执行子任务
      inlineOptions.watch
        ? await api.consumeHandler('assemble:watch', [inlineOptions])
        : await api.consumeHandler('assemble:once', [inlineOptions]);
    });
});
