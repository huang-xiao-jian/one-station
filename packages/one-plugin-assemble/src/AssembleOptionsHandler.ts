import { OnePluginApi } from '@one/plugin';
import * as fse from 'fs-extra';
import * as path from 'path';

import type {
  AssembleInlineOptions,
  AssembleOption,
  AssembleTaskInternal,
} from './options.interface';

export class AssembleOptionsHandler {
  constructor(private readonly api: OnePluginApi) {}

  /**
   * TODO - 入参校验
   */
  async handle(options: AssembleInlineOptions): Promise<AssembleTaskInternal[]> {
    const outDir: string = this.api.consumeConfig('outDir');
    const root: string = this.api.consumeConfig('root');
    const assembleOptions: AssembleOption = this.api.consumeConfig('assemble');
    const tasks: AssembleTaskInternal[] = assembleOptions.tasks.map((task) => ({
      name: `${task.workspace}.${task.directory}`,
      source: path.resolve(root, task.workspace, task.directory, task.artifact),
      destiny: path.resolve(outDir, task.assignment),
    }));

    // 清理目录
    if (options.clean) {
      await fse.remove(outDir);
    }
    // 保证输出目录存在
    await fse.ensureDir(outDir);
    // 允许源目录不存在，入参部分兼容
    await Promise.all(tasks.map((task) => fse.ensureDir(task.source)));

    return tasks;
  }
}
