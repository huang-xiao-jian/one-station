import type {
  ICommandDescriptor,
  IConfigDescriptor,
  ICosmiConfigDescriptor,
  IEnvironmentVariableDescriptor,
  OnePluginApi,
} from '@one/plugin';
import assert from 'assert';
import { createCommand } from 'commander';
import { Inject, Injectable } from 'injection-js';
import Joi from 'joi';
import { isFunction, isNil } from 'lodash';

import { CommandHooks } from './CommandHooks';
import { ConfigFileToken } from './ConfigFile';
import type { ConfigFile } from './ConfigFile';

@Injectable()
export class OnePlatform implements OnePluginApi {
  /**
   * 内部存储子命令
   */
  private readonly commands: Map<string, CommandHooks> = new Map();
  /**
   * 内部存储职能函数
   */
  private readonly handlers: Map<string, Function> = new Map();
  /**
   * 内部存储职能函数
   */
  private readonly configStore: Map<string, IConfigDescriptor> = new Map();
  /**
   * 内部存储职能函数
   */
  private readonly cosmicStore: Map<string, ICosmiConfigDescriptor> = new Map();
  /**
   * 内部存储职能函数
   */
  private readonly environmentVariableStore: Map<string, IEnvironmentVariableDescriptor> =
    new Map();

  constructor(@Inject(ConfigFileToken) private readonly configFile: ConfigFile) {}

  /**
   * TODO - 冲突检测
   */
  registerCommand(cmd: ICommandDescriptor): CommandHooks {
    // command 内部形态
    const command = new CommandHooks(cmd.name, cmd.description);

    // 保存注册记录
    this.commands.set(cmd.name, command);

    return command;
  }

  /**
   * 调用注册子命令，主命令单独实现
   */
  async consumeCommand(name: string) {
    const hooks = this.commands.get(name);
    const command = createCommand();

    // 类型安全
    assert.ok(hooks);

    // 有限初始化
    command.name(hooks.name).description(hooks.description);

    // TODO - 参数定义暂且委托插件处理，挺诡异的方案
    hooks.behaviors.forEach((behavior) => {
      behavior(command);
    });

    // TODO
    command.action(async () => {
      await Promise.all(hooks.actions.map((action) => action(command)));
    });

    /**
     * @link - https://www.npmjs.com/package/commander#automated-help
     */
    await command.parseAsync(process.argv.slice(3), { from: 'user' });
  }

  /**
   * TODO - 冲突检测
   */
  registerConfig(config: IConfigDescriptor) {
    this.configStore.set(config.key, config);
  }

  /**
   * 生成者模型，为插件体系声明属性访问控制
   */
  consumeConfig(name: string) {
    const descriptor = this.configStore.get(name);

    assert(descriptor);

    const originalConfigValue = this.configFile.configuration[name];

    if (isNil(originalConfigValue)) {
      if (!isNil(descriptor.default)) {
        return isFunction(descriptor.default)
          ? descriptor.default(this.configFile.filename)
          : descriptor.default;
      }

      throw new Error(`[ConfigManager] missing ${descriptor.key} within one config file`);
    }

    // 值转换
    const configValue = isNil(descriptor.transform)
      ? originalConfigValue
      : descriptor.transform({
          rcfile: this.configFile.filename,
          value: originalConfigValue,
        });

    // 校验入参
    Joi.assert(configValue, descriptor.schema);

    return configValue;
  }

  /**
   * TODO - 冲突检测
   */
  registerCosmiConfig(config: ICosmiConfigDescriptor) {
    this.cosmicStore.set(config.name, config);
  }

  /**
   * TODO - 冲突检测
   */
  registerEnvironmentVariable(environment: IEnvironmentVariableDescriptor) {
    this.environmentVariableStore.set(environment.name, environment);
  }

  /**
   * 环境变量计算：
   *   1. 插件环境变量必须遵循先声明后使用风格
   *   2. 环境变量一般推荐为可选含默认值
   */
  async consumeEnvironmentVariable(name: string) {
    const descriptor = this.environmentVariableStore.get(name);

    assert.ok(descriptor);

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

  /**
   * TODO - 冲突检测
   */
  registerHandler<N extends keyof OneHandlerMapping>(name: N, handler: OneHandlerMapping[N]) {
    this.handlers.set(name, handler);
  }

  /**
   * TODO - 类型安全检测
   */
  consumeHandler<N extends keyof OneHandlerMapping, R = ReturnType<OneHandlerMapping[N]>>(
    name: N,
    args: Parameters<OneHandlerMapping[N]>,
  ): R {
    const handler = this.handlers.get(name);

    assert.ok(handler, `[OneApi] missing handler for ${name}`);

    return handler.apply(null, args);
  }
}
