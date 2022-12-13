import { OnePluginApi } from '@one/plugin';
import { Command } from 'commander';
import * as fse from 'fs-extra';
import * as path from 'path';

import { AssembleInlineOptions, AssembleOption, AssembleTaskInternal } from './options.interface';

export class AssembleOptionsHandler {
  /**
   * TODO - 入参校验
   */
  async handle(api: OnePluginApi): Promise<AssembleTaskInternal[]> {
    const outDir = api.injection.config<string>('outDir');
    const root = api.injection.config<string>('root');
    const assembleOptions = api.injection.config<AssembleOption>('assemble');
    const tasks: AssembleTaskInternal[] = assembleOptions.tasks.map((task) => ({
      name: `${task.workspace}.${task.directory}`,
      source: path.resolve(root, task.workspace, task.directory, task.artifact),
      destiny: path.resolve(outDir, task.assignment),
    }));

    // 保证输出目录存在
    await fse.ensureDir(outDir);
    // 允许源目录不存在，入参部分兼容
    await Promise.all(tasks.map((task) => fse.ensureDir(task.source)));

    return tasks;
  }
}
