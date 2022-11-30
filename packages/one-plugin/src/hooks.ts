import { IOneCommandPluginRegistry } from './command/registry.interface';

export interface OnePluginHooks {
  /**
   * 命令行管理周期
   */
  onCommandInit: (hooks: IOneCommandPluginRegistry) => void;
}
