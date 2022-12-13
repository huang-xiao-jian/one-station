import { OnePluginApi } from '@one/plugin';
import * as fse from 'fs-extra';
import * as path from 'path';

import type { AssembleOption, AssembleTaskInternal } from './options.interface';

export class AssembleOptionsHandler {
  /**
   * TODO - 入参校验
   */
  async handle(api: OnePluginApi): Promise<AssembleTaskInternal[]> {
    const outDir: string = api.consumeHandler('config:read', ['outDir']);
    const root: string = api.consumeHandler('config:read', ['root']);
    const assembleOptions: AssembleOption = api.consumeHandler('config:read', ['assemble']);
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
