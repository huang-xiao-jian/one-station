import { OnePluginHooks, IOneCommandPluginRegistry } from '@one/plugin';

class OneCommandAssemble implements OnePluginHooks {
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: IOneCommandPluginRegistry) {
    hooks
      .registerCommand({
        name: 'assemble',
        description: 'yet, assemble plugin to aggregate artifacts',
      })
      .defineEnvironment({
        name: 'NODE_ENV',
        description: 'yet, convenient way for adjust internal behavior',
        default: 'development',
      })
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
  }
}

export default new OneCommandAssemble();
