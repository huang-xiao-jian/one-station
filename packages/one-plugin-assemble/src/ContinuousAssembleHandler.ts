import { AssembleTaskInternal } from './options.interface';
import { FileWatcher } from './FileWatcher';

export class ContinuousAssembleHandler {
  async handle(tasks: AssembleTaskInternal[]) {
    // 诡异的模块定义风格
    const chalk = await import('chalk');
    // 任务执行提示信息
    console.log(chalk.default.magenta(`[Watch Assemble]:`));

    await Promise.all(
      tasks.map(async (task) => {
        // 每个任务独立 watcher，方便后续升级迭代
        const watcher = new FileWatcher();

        // 文件同步
        await watcher.handle(task.source, task.destiny);
      }),
    );
  }
}
