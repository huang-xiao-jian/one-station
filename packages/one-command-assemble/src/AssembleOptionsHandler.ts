import { Command } from 'commander';
import * as path from 'path';
import * as fse from 'fs-extra';
import { ICommandInjection } from '@one/plugin';
import { AssembleInlineOptions, AssembleOption, AssembleTaskInternal } from './options.interface';

export class AssembleOptionsHandler {
  constructor(
    // 子命令
    private readonly command: Command,
    // 外部存储
    private readonly injection: ICommandInjection,
  ) {}

  /**
   * TODO - 入参校验
   */
  async handle(): Promise<AssembleTaskInternal[]> {
    const outDir = this.injection.config<string>('outDir');
    const root = this.injection.config<string>('root');
    const inlineOptions: AssembleInlineOptions = this.command.opts();
    const assembleOptions: AssembleOption = this.injection.config('assemble');
    const tasks: AssembleTaskInternal[] = assembleOptions.tasks.map((task) => ({
      name: `${task.workspace}.${task.directory}`,
      source: path.resolve(root, task.workspace, task.directory, task.artifact),
      destiny: path.resolve(outDir, task.assignment),
      watch: inlineOptions.watch,
    }));

    // 保证输出目录存在
    await fse.ensureDir(outDir);
    // 允许源目录不存在，入参部分兼容
    await Promise.all(tasks.map((task) => fse.ensureDir(task.source)));

    return tasks;
  }
}
