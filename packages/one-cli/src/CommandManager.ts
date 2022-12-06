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
      .name('one')
      .version('v0.1.0')
      .description('yet, vscode flavor architecture for pandora');

    // 插件命令生效
    this.commandRegistry.commands.forEach((commandHooks) => {
      const command = createCommand();

      // 有限初始化
      command.name(commandHooks.name).description(commandHooks.description);
      // TODO - 参数定义暂且委托插件处理，挺诡异的方案
      commandHooks.behaviors.forEach((behavior) => {
        behavior(command);
      });
      // TODO
      command.action(async () => {
        await Promise.all(
          commandHooks.actions.map((action) => action(this.commandInjection)(command)),
        );
      });

      // TODO - 参数访问显式声明
      // TODO - 挂载主程序，后续探索优雅方案，按需加载
      program.addCommand(command);
    });

    await program.parseAsync();
  }
}
