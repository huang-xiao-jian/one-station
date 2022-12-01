import { OnePluginHooks, ICommandPluginRegistry, IConfigRegistry } from '@one/plugin';
import { AssembleOptionSchema } from './options.schema';

const OneCommandAssemble: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IConfigRegistry) {
    hooks.registerConfig({
      key: 'assemble',
      schema: AssembleOptionSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandPluginRegistry) {
    hooks
      .registerCommand({
        name: 'assemble',
        description: 'yet, assemble plugin to aggregate artifacts',
      })
      .referenceConfig('assemble')
      .referenceEnvironmentVariable('NODE_ENV')
      .defineBehavior((command) => {
        command.option('-w, --watch [watch]', 'assemble in continuous mode');
      })
      .defineAction((injection) => (command) => {
        console.group('OneCommandAssemble');
        console.log('NODE_ENV:', injection.env('NODE_ENV'));
        console.log('Arguments:', command.args);
        console.log('Options: ', command.opts());
        console.groupEnd();
      });
  },
};

export default OneCommandAssemble;
