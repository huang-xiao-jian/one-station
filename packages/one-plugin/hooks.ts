import { ICommandDescriptor } from './Command';

/**
 * 被动模式注册命令行
 */
export interface OneCommandPluginHooks {
  registerCommand: (cmd: ICommandDescriptor) => void;
}

export interface OnePluginHooks {
  /**
   * 被动模式注册命令行
   */
  onCommandInit: (hooks: OneCommandPluginHooks) => void;
}
