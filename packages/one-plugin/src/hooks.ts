import { ICommandPluginRegistry } from './registry.interface';
import { IConfigRegistry } from './config.interface';

export interface OnePluginHooks {
  /**
   * 配置内容扫描阶段，声明配置内容
   */
  onConfigInit?: (hooks: IConfigRegistry) => void;
  /**
   * 命令行声明
   */
  onCommandInit: (hooks: ICommandPluginRegistry) => void;
}
