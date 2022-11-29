import { OnePluginHooks, OneCommandPluginHooks } from '@one/plugin';

class OneCommandAssemble implements OnePluginHooks {
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: OneCommandPluginHooks) {
    hooks.registerCommand({
      name: 'assemble',
      description: 'yet, assemble plugin to aggregate artifacts',
      onOptions(command) {
        command.option('-w, --watch [watch]', 'assemble in continuous mode');
      },
      async onAction(command) {
        console.group('OneCommandAssemble');
        console.log(command.args);
        console.log(command.opts());
        console.groupEnd();
      },
    });
  }
}

export default new OneCommandAssemble();
