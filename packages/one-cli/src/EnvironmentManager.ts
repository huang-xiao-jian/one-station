import { Injectable } from 'injection-js';
import { cosmiconfig } from 'cosmiconfig';
import { isNil } from 'lodash';
import assert from 'assert';
import { PivotRegistry } from './PivotRegistry';

const EXPLORER = cosmiconfig('one', {
  searchPlaces: [`package.json`, `.onerc`, `.onerc.yml`, `.onerc.json`],
});

interface OneConfigFile {
  /**
   * 配置文件绝对路径，用以进行特定路径参数拼接
   */
  filename: string;
  /**
   * 用户配置文件，限定为对象，内容由插件声明
   */
  configuration: Record<string, any>;
}

@Injectable()
export class EnvironmentManager {
  constructor(private readonly pivotRegistry: PivotRegistry) {}

  /**
   * 环境变量计算：
   *   1. 插件环境变量必须遵循先声明后使用风格
   *   2. 环境变量一般推荐为可选含默认值
   */
  consumeEnvironmentVariable(name: string) {
    const descriptor = this.pivotRegistry.provideEnvironmentVariable(name);
    const raw = process.env[descriptor.name];

    // 环境变量未定义，透传默认值即可
    if (isNil(raw)) {
      return descriptor.default;
    }

    // 支持用户自定义转换器
    if (descriptor.transform) {
      return descriptor.transform(raw);
    }

    return raw;
  }
}
