import { Command } from 'commander';

export interface ICommandDescriptor {
  /**
   * 子命令名称
   */
  name: string;
  /**
   * 子命令功能描述
   */
  description: string;
  /**
   * 命令行入参设置
   */
  onInit: (command: Command) => void;
  /**
   * 命令行功能实现
   */
  onAction: (command: Command) => void;
}
