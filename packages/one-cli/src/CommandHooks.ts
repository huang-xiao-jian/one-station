import { ICommandAction, ICommandBehavior, ICommandHooks } from '@one/plugin';
import { Command } from 'commander';
import { isString } from 'lodash';
import { CommandAccessor } from './CommandAccessor';

export class CommandHooks implements ICommandHooks {
  // 内部存储环境变量依赖
  private readonly environments: Set<string> = new Set();
  // 内部存储配置文件字段
  private readonly configs: Set<string> = new Set();

  constructor(private readonly command: Command, private readonly accessor: CommandAccessor) {}

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
    behavior(this.command);

    return this;
  }

  defineAction(action: ICommandAction) {
    // 统一匹配为异步执行上下文
    this.command.action(async () => {
      await action(this.accessor)(this.command);
    });
  }
}
