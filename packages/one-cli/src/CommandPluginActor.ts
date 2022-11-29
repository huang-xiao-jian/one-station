import { ICommandDescriptor, OneCommandPluginHooks } from '@one/plugin';

export class OneCommandPluginActor implements OneCommandPluginHooks {
  /**
   * 存储内部命令行实例
   */
  public commands: ICommandDescriptor[] = [];

  /**
   * TODO - conflict detection
   */
  registerCommand(cmd: ICommandDescriptor) {
    this.commands.push(cmd);
  }
}
