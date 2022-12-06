import { OnePluginHooks, ICommandRegistry, IPivotRegistry } from '@one/plugin';
import { AssembleInlineOptions } from './options.interface';
import { AssembleOptionSchema } from './options.schema';
import { AssembleHandler } from './AssembleHandler';
import { AssembleOptionsHandler } from './AssembleOptionsHandler';
import { ContinuousAssembleHandler } from './ContinuousAssembleHandler';

const CommandAssemble: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'assemble',
      schema: AssembleOptionSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'assemble',
        description: 'yet, assemble plugin to aggregate artifacts',
      })
      .referenceConfig(['root', 'ourDir', 'assemble'])
      .defineBehavior((command) => {
        command.option('-w, --watch [watch]', 'assemble in continuous mode');
      })
      .defineAction((injection) => async (command) => {
        const inlineOptions: AssembleInlineOptions = command.opts();
        const assembleOptionsHandler = new AssembleOptionsHandler();
        const tasks = await assembleOptionsHandler.handle(command, injection);
        const assembleHandler = inlineOptions.watch
          ? new ContinuousAssembleHandler()
          : new AssembleHandler();

        // 实际执行子任务
        await assembleHandler.handle(tasks);
      });
  },
};

export default CommandAssemble;
