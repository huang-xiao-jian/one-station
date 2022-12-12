import { ICommandDescriptor, ICommandRegistry } from '@one/plugin';
import assert from 'assert';
import { Injectable } from 'injection-js';

import { CommandHooks } from './CommandHooks';

/**
 * 命令行注册中心，标准单例模式
 */
@Injectable()
export class CommandRegistry implements ICommandRegistry {
  /**
   * 内部存储子命令
   */
  readonly commands: Map<string, CommandHooks> = new Map();

  /**
   * TODO - 冲突检测
   */
  registerCommand(cmd: ICommandDescriptor): CommandHooks {
    const command = new CommandHooks(cmd.name, cmd.description);

    // 保存注册记录
    this.commands.set(cmd.name, command);

    return command;
  }

  /**
   * 中转命令行定义
   */
  provideCommand(name: string): CommandHooks {
    const command = this.commands.get(name);

    assert.ok(command, `[CommandRegistry] missing command definition for ${name}`);

    return command;
  }
}
