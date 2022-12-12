import { createCommand, program } from 'commander';
import { Injectable } from 'injection-js';

import { CommandInjection } from './CommandInjection';
import { CommandRegistry } from './CommandRegistry';

@Injectable()
export class CommandManager {
  constructor(
    private readonly commandRegistry: CommandRegistry,
    private readonly commandInjection: CommandInjection,
  ) {}

  /**
   * 命令行注册执行中心
   */
  async consumeCommands() {
    // 初始化主命令
    program
      .enablePositionalOptions()
      .passThroughOptions()
      .name('one')
      .version('v0.1.0')
      .description('yet, vscode flavor architecture for pandora')
      .argument('<cmd>', 'the expected running sub command')
      .action(async (cmd) => {
        const hooks = this.commandRegistry.provideCommand(cmd);
        const command = createCommand();

        // 有限初始化
        command.name(hooks.name).description(hooks.description);

        // TODO - 参数定义暂且委托插件处理，挺诡异的方案
        hooks.behaviors.forEach((behavior) => {
          behavior(command);
        });

        // TODO
        command.action(async () => {
          await Promise.all(hooks.actions.map((action) => action(this.commandInjection)(command)));
        });

        /**
         * @link - https://www.npmjs.com/package/commander#automated-help
         */
        await command.parseAsync(process.argv.slice(3), { from: 'user' });
      });

    await program.parseAsync();
  }
}
