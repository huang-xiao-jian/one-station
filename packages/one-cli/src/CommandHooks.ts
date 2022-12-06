import { ICommandAction, ICommandBehavior, ICommandHooks } from '@one/plugin';
import { isString } from 'lodash';

export class CommandHooks implements ICommandHooks {
  // 内部存储环境变量依赖
  readonly environments: Set<string> = new Set();
  // 内部存储配置文件字段
  readonly configs: Set<string> = new Set();
  // 内部存储行为定义
  readonly behaviors: ICommandBehavior[] = [];
  // 原则上，ACTION 必须为单一函数，后续考虑扩展开放
  readonly actions: ICommandAction[] = [];

  constructor(public readonly name: string, public readonly description: string) {}

  referenceEnvironmentVariable(names: string | string[]) {
    const dependencies = isString(names) ? [names] : names;

    dependencies.forEach((dep) => {
      this.environments.add(dep);
    });

    // 支持链式调用
    return this;
  }

  referenceConfig(names: string | string[]) {
    const dependencies = isString(names) ? [names] : names;

    dependencies.forEach((dep) => {
      this.configs.add(dep);
    });

    // 支持链式调用
    return this;
  }

  defineBehavior(behavior: ICommandBehavior) {
    this.behaviors.push(behavior);

    return this;
  }

  defineAction(action: ICommandAction) {
    this.actions.push(action);

    return this;
  }
}
