import { Injectable } from 'injection-js';
import { ICommandAccessor } from '@one/plugin';
import { PivotRegistry } from './PivotRegistry';
import { EnvironmentManager } from './EnvironmentManager';
import { ConfigManager } from './ConfigManager';

@Injectable()
export class CommandAccessor implements ICommandAccessor {
  constructor(
    private readonly configManager: ConfigManager,
    private readonly environmentManager: EnvironmentManager,
  ) {}
  /**
   * 环境变量访问器
   */
  env<T>(name: string): T {
    return this.environmentManager.consumeEnvironmentVariable(name);
  }

  /**
   * 配置文件项访问器
   */
  config<T>(name: string): T {
    throw new Error('TODO NOT FINISHED');
  }

  /**
   * 外源性配置文件访问器
   */
  cosmic<T = any>(name: string): T {
    throw new Error('TODO NOT FINISHED');
  }
}
