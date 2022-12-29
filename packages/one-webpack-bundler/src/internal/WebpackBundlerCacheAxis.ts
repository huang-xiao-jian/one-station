import fse from 'fs-extra';
import { Inject, Injectable } from 'injection-js';
import path from 'path';

import { WebpackBuildOptionsToken } from './BuildOptions';
import type { WebpackBuildOptions } from './BuildOptions';

/**
 * 缓存目录分配
 */
@Injectable()
export class WebpackBundlerCacheAxis {
  constructor(@Inject(WebpackBuildOptionsToken) private readonly options: WebpackBuildOptions) {}

  /**
   * 使用相对路径分配
   */
  async request(pathname: string) {
    const cwd = this.options.cwd;
    const basedir = path.resolve(cwd, 'node_modules', '.wb-cache');
    const destiny = path.resolve(basedir, pathname);

    // 确保缓存目录存在
    await fse.ensureDir(destiny);

    return destiny;
  }
}
