import { ICommandDescriptor, ICommandRegistry } from '@one/plugin';
import { Injectable } from 'injection-js';
import { Command, createCommand } from 'commander';
import { CommandHooks } from './CommandHooks';
import { CommandAccessor } from './CommandAccessor';

/**
 * 命令行注册中心，标准单例模式
 */
@Injectable()
export class CommandRegistry implements ICommandRegistry {
  /**
   * 内部存储子命令
   */
  private readonly mappings: Map<string, Command> = new Map();

  /**
   * 暂且使用统一注册信息访问器，后续进行精细化改造
   */
  constructor(private readonly accessor: CommandAccessor) {}

  /**
   * 通过访问器屏蔽内部存储方式
   */
  get commands() {
    return Array.from(this.mappings.values());
  }

  /**
   * TODO - 冲突检测
   */
  registerCommand(cmd: ICommandDescriptor) {
    const command = createCommand();

    // 保存注册记录
    this.mappings.set(cmd.name, command);

    // 有限初始化
    command.name(cmd.name).description(cmd.description);

    return new CommandHooks(command, this.accessor);
  }
}
