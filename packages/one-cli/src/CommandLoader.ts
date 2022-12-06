import { Inject, Injectable } from 'injection-js';
import CommandAssemble from '@one/command-assemble';
import CommandCore from '@one/command-core';
import CommandStaffToolkit from '@one/command-staff-toolkit';

import { ConfigFileToken } from './ConfigFile';
import type { ConfigFile } from './ConfigFile';
import { PivotRegistry } from './PivotRegistry';
import { CommandRegistry } from './CommandRegistry';

/**
 * 命令行注册中心，标准单例模式
 */
@Injectable()
export class CommandLoader {
  constructor(
    @Inject(ConfigFileToken) private readonly configFile: ConfigFile,
    private readonly pivotRegistry: PivotRegistry,
    private readonly commandRegistry: CommandRegistry,
  ) {}

  /**
   * 加载配置插件
   * TODO - 插件体系设计尚未完善，插件配置暂不生效，使用全量预加载模式
   */
  async scan() {
    // 插件声明为强制，前置配置加载器负责校验入参合法性
    // 标准化模板代码
    CommandCore.onConfigInit?.(this.pivotRegistry);
    CommandCore.onCommandInit?.(this.commandRegistry);
    CommandAssemble.onConfigInit?.(this.pivotRegistry);
    CommandAssemble.onCommandInit?.(this.commandRegistry);
    CommandStaffToolkit.onConfigInit?.(this.pivotRegistry);
    CommandStaffToolkit.onCommandInit?.(this.commandRegistry);
  }
}
