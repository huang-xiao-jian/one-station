import { Command } from 'commander';
import * as path from 'path';
import * as fse from 'fs-extra';
import { ICommandInjection } from '@one/plugin';
import { AssembleInlineOptions, AssembleOption, AssembleTaskInternal } from './options.interface';

export class AssembleOptionsHandler {
  /**
   * TODO - 入参校验
   */
  async handle(command: Command, injection: ICommandInjection): Promise<AssembleTaskInternal[]> {
    const outDir = injection.config<string>('outDir');
    const root = injection.config<string>('root');
    const inlineOptions: AssembleInlineOptions = command.opts();
    const assembleOptions: AssembleOption = injection.config('assemble');
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
