import * as fse from 'fs-extra';
import { AssembleTaskInternal } from './options.interface';

export class AssembleHandler {
  async handle(tasks: AssembleTaskInternal[]) {
    const chalk = await import('chalk');

    // 源目录不存在直接报错即可，不符合配置预期
    await Promise.all(
      tasks.map(async (task) => {
        await fse.copy(task.source, task.destiny);

        // 任务执行提示信息
        console.log(chalk.default.green(`[Assemble]: ${task.name} assemble success`));
      }),
    );
  }
}
