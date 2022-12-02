import { Injectable } from 'injection-js';
import {
  IConfigDescriptor,
  ICosmiConfigDescriptor,
  IEnvironmentVariableDescriptor,
  IPivotRegistry,
} from '@one/plugin';

/**
 * 集中管理插件注册，包括环境变量、配置项、外源性配置文件
 */
@Injectable()
export class PivotRegistry implements IPivotRegistry {
  private readonly configStore: Map<string, IConfigDescriptor> = new Map();

  private readonly cosmicStore: Map<string, ICosmiConfigDescriptor> = new Map();

  private readonly environmentVariableStore: Map<string, IEnvironmentVariableDescriptor> =
    new Map();

  registerConfig(config: IConfigDescriptor) {
    this.configStore.set(config.key, config);
  }

  provideConfig(key: string): IConfigDescriptor {
    const descriptor = this.configStore.get(key);

    if (!descriptor) {
      throw new Error(`[PivotRegistry] Config property ${key} must declare before usage`);
    }

    return descriptor;
  }

  registerCosmiConfig(config: ICosmiConfigDescriptor) {
    this.cosmicStore.set(config.name, config);
  }

  provideCosmiConfig(name: string) {}

  registerEnvironmentVariable(environment: IEnvironmentVariableDescriptor) {
    this.environmentVariableStore.set(environment.name, environment);
  }

  provideEnvironmentVariable(name: string): IEnvironmentVariableDescriptor {
    const descriptor = this.environmentVariableStore.get(name);

    if (!descriptor) {
      throw new Error(`[PivotRegistry] Env variable ${name} must declare before usage`);
    }

    return descriptor;
  }
}
