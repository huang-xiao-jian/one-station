import type { IConfigTransformMaterial } from '@one/plugin';
import { createOnePlugin } from '@one/plugin-runner';
import Joi from 'joi';
import path from 'path';

export default createOnePlugin((api) => {
  /**
   * 推荐设置为项目根目录
   */
  api.registerConfig({
    key: 'root',
    schema: Joi.string(),
    /**
     * 少数特殊属性必须内建，项目根目录标记，默认为配置文件所在目录
     */
    default: (rcFile: string) => path.dirname(rcFile),
    transform(material: IConfigTransformMaterial<string>) {
      return path.join(material.rcfile, material.value);
    },
  });

  /**
   * 输出目录，独立项目、monorepo 相同逻辑
   */
  api.registerConfig({
    key: 'outDir',
    schema: Joi.string(),
    default: (rcFile: string) => {
      return path.join(path.dirname(rcFile), 'dist');
    },
    transform(material: IConfigTransformMaterial<string>) {
      return path.join(material.rcfile, material.value);
    },
  });

  /**
   * 核心环境变量，回收内部插件处理
   */
  api.registerEnvironmentVariable({
    name: 'NODE_ENV',
    description: 'yet, convenient way for adjust internal behavior',
    default: 'development',
  });
});
