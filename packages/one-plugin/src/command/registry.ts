import { Command, createCommand } from 'commander';
import { isNil } from 'lodash';
import assert from 'assert';
import {
  ICommandAction,
  ICommandBehavior,
  ICommandDescriptor,
  ICommandEnvironmentDescriptor,
  IEnvironmentPair,
} from './command.interface';
import { IOneCommandHooks, IOneCommandPluginRegistry } from './registry.interface';
import { CommandInjection } from './command';

export class OneCommandHooks implements IOneCommandHooks {
  // 内部存储环境变量依赖
  private readonly environments: Map<string, ICommandEnvironmentDescriptor<any>> = new Map();

  // 命令行行为限定声明一次
  private sealed: boolean = false;

  constructor(private readonly command: Command) {}

  private lock() {
    assert.ok(
      this.sealed !== true,
      `[OneCommandHooks] command ${this.command.name} has already define action`,
    );

    this.sealed = true;
  }

  defineEnvironment(environment: ICommandEnvironmentDescriptor<any>) {
    // 内部存储环境变量依赖
    this.environments.set(environment.name, environment);

    // 支持链式调用
    return this;
  }

  defineBehavior(behavior: ICommandBehavior) {
    // 注册如此那
    behavior(this.command);

    // 支持链式调用
    return this;
  }

  defineAction(action: ICommandAction) {
    // 冲突检测
    this.lock();

    // 依赖处理
    const environments: IEnvironmentPair[] = Array.from(this.environments.values()).map(
      (environment) => {
        const value = process.env[environment.name];

        // 环境变量未定义，透传默认值即可
        if (isNil(value)) {
          return {
            name: environment.name,
            value: environment.default,
          };
        }

        if (environment.transform) {
          return {
            name: environment.name,
            value: environment.transform(value),
          };
        }

        return {
          name: environment.name,
          value,
        };
      },
    );

    const injection = new CommandInjection(environments);

    // 统一匹配为异步执行上下文
    this.command.action(async () => {
      await action(injection)(this.command);
    });
  }
}

export class OneCommandPluginRegistry implements IOneCommandPluginRegistry {
  /**
   * 内部存储子命令
   */
  private readonly mappings: Map<string, Command> = new Map();

  /**
   * 通过访问器屏蔽内部存储方式
   */
  get commands() {
    return Array.from(this.mappings.values());
  }

  /**
   * TODO - 冲突检测
   */
  registerCommand(cmd: ICommandDescriptor) {
    const command = createCommand();

    // 保存注册记录
    this.mappings.set(cmd.name, command);

    // 有限初始化
    command.name(cmd.name).description(cmd.description);

    return new OneCommandHooks(command);
  }
}
