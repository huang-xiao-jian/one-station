import * as fse from 'fs-extra';
import { watch } from 'chokidar';
import path from 'path';

/**
 * 处理文件系统目录单向同步
 */
export class FileWatcher {
  async handle(source: string, destiny: string) {
    // 诡异的模块定义风格
    const chalk = await import('chalk');

    // 初始化全量同步
    await fse.copy(source, destiny);

    // 任务执行提示信息
    console.log(chalk.default.green(` - watching ${source}`));

    const watcher = watch(source, {
      cwd: source,
      ignoreInitial: true,
    });

    watcher.on('add', (file) => {
      const original = path.resolve(source, file);
      const final = path.resolve(destiny, file);

      // 非阻塞模式
      fse.copy(original, final, () => {
        console.log(chalk.default.cyan(` - File: ${file} sync success`));
      });
    });

    watcher.on('change', (file) => {
      const original = path.resolve(source, file);
      const final = path.resolve(destiny, file);

      // 非阻塞模式
      fse.copy(original, final, () => {
        console.log(chalk.default.cyan(` - File: ${file} sync success`));
      });
    });

    watcher.on('unlink', (file) => {
      const final = path.resolve(destiny, file);

      // 非阻塞模式
      fse.unlink(final, () => {
        console.log(chalk.default.cyan(` - File: ${file} sync success`));
      });
    });
  }
}
