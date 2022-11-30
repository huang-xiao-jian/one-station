import { find } from 'lodash';
import { ICommandInjection, IEnvironmentPair } from './command.interface';

export class CommandInjection implements ICommandInjection {
  constructor(private readonly envs: IEnvironmentPair[]) {}

  /**
   * 环境变量访问器
   */
  env(name: string) {
    return find(this.envs, ['name', name])?.value;
  }
}
