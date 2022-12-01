import { ICommandRegistry } from './registry.interface';
import { IPivotRegistry } from './config.interface';

export interface OnePluginHooks {
  /**
   * 配置内容扫描阶段，声明配置内容
   */
  onConfigInit?: (hooks: IPivotRegistry) => void;
  /**
   * 命令行声明
   */
  onCommandInit?: (hooks: ICommandRegistry) => void;
}
