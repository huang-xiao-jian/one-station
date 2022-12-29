import CopyPlugin, { Pattern } from 'copy-webpack-plugin';
import fse from 'fs-extra';
import { isEmpty } from 'lodash';
import path from 'path';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

/**
 * 约定俗成：复制 public 目录内文件
 *
 * serve 模式无需额外处理，webpack-dev-server 预处理相应。
 */
export class CopyConsistentPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('CopyConsistentPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('CopyConsistentPluginInitialize', async (chain) => {
        const cwd = wbi.config<string>('cwd');
        // 约定俗成风格
        const publicDir = path.resolve(cwd, 'public');
        const patterns: Pattern[] = [];
        const publicDirExists = await fse.pathExists(publicDir);

        // 调用者负责确认目标目录存在
        if (publicDirExists) {
          patterns.push({
            from: publicDir,
            // ref: https://github.com/webpack-contrib/copy-webpack-plugin#info
            // Set minimized so terser will not do minimize
            info: { minimized: true },
          });
        }

        /**
         * copy-webpack-plugin 限制必须最少存在一条规则
         */
        if (!isEmpty(patterns)) {
          chain.plugin('copy-webpack-plugin').use(CopyPlugin, [
            {
              patterns,
            },
          ]);
        }
      });
    });
  }
}
