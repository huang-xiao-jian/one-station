import { Injectable } from 'injection-js';
import {
  IConfigDescriptor,
  ICosmiConfigDescriptor,
  IEnvironmentVariableDescriptor,
  IPivotRegistry,
} from '@one/plugin';
import { isNil } from 'lodash';

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
  registerCosmiConfig(config: ICosmiConfigDescriptor) {
    this.cosmicStore.set(config.name, config);
  }
  registerEnvironmentVariable(environment: IEnvironmentVariableDescriptor) {
    this.environmentVariableStore.set(environment.name, environment);
  }

  /**
   * 环境变量计算：
   *   1. 插件环境变量必须遵循先声明后使用风格
   *   2. 环境变量一般推荐为可选含默认值
   */
  consumeEnvironmentVariable(name: string) {
    const descriptor = this.environmentVariableStore.get(name);

    if (!descriptor) {
      throw new Error(`[PivotRegistry] Env variable ${name} must declare before usage`);
    }

    const raw = process.env[descriptor.name];

    // 环境变量未定义，透传默认值即可
    if (isNil(raw)) {
      return descriptor.default;
    }

    // 支持用户自定义转换器
    if (descriptor.transform) {
      return descriptor.transform(raw);
    }

    return raw;
  }
}
