import { program } from 'commander';
import { Injectable } from 'injection-js';

import { OnePlatform } from './OnePlatform';

@Injectable()
export class CommandManager {
  constructor(private readonly platform: OnePlatform) {}

  /**
   * 命令行注册执行中心
   */
  async bootstrap() {
    // 初始化主命令
    program
      .enablePositionalOptions()
      .passThroughOptions()
      .name('one')
      .version('v0.1.0')
      .description('yet, vscode flavor architecture for pandora')
      .argument('<cmd>', 'the expected running sub command')
      .action(async (cmd) => {
        await this.platform.consumeCommand(cmd);
      });

    await program.parseAsync();
  }
}
