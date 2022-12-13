import { createOnePlugin } from '@one/plugin-runner';

import { AssembleHandler } from './AssembleHandler';
import { AssembleOptionsHandler } from './AssembleOptionsHandler';
import { ContinuousAssembleHandler } from './ContinuousAssembleHandler';
import { AssembleInlineOptions, AssembleTaskInternal } from './options.interface';
import { AssembleOptionSchema } from './options.schema';

declare global {
  interface OneHandlerMapping {
    'assemble:once': (tasks: AssembleTaskInternal[]) => Promise<void>;
    'assemble:watch': (tasks: AssembleTaskInternal[]) => Promise<void>;
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
   * 导出核心功能，一次性聚合产物
   */
  api.registerHandler('assemble:once', async (tasks: AssembleTaskInternal[]) => {
    const handler = new AssembleHandler();

    await handler.handle(tasks);
  });

  /**
   * 导出核心功能，持续聚合产物
   */
  api.registerHandler('assemble:watch', async (tasks: AssembleTaskInternal[]) => {
    const handler = new ContinuousAssembleHandler();

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
      command.option('-w, --watch [watch]', 'assemble in continuous mode');
    })
    .defineAction(async (command) => {
      const assembleOptionsHandler = new AssembleOptionsHandler();
      const inlineOptions: AssembleInlineOptions = command.opts();
      const tasks = await assembleOptionsHandler.handle(api);

      // 实际执行子任务
      inlineOptions.watch
        ? await api.consumeHandler('assemble:watch', [tasks])
        : await api.consumeHandler('assemble:once', [tasks]);
    });
});
