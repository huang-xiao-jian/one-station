import { Injectable, Inject } from 'injection-js';
import { cosmiconfig } from 'cosmiconfig';
import Joi from 'joi';
import assert from 'assert';
import { isNil, isFunction } from 'lodash';
import { PivotRegistry } from './PivotRegistry';
import { ConfigFileToken } from './ConfigFile';
import type { ConfigFile } from './ConfigFile';

const EXPLORER = cosmiconfig('one', {
  searchPlaces: [`package.json`, `.onerc`, `.onerc.yml`, `.onerc.json`],
});

interface RawConfigFile {
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
export class ConfigManager {
  constructor(
    private readonly pivotRegistry: PivotRegistry,
    @Inject(ConfigFileToken) private readonly configFile: ConfigFile,
  ) {}

  /**
   * 生成者模型，为插件体系声明属性访问控制
   */
  consumeConfigProperty(key: string) {
    const descriptor = this.pivotRegistry.provideConfig(key);
    const originalConfigValue = this.configFile.configuration[key];

    if (isNil(originalConfigValue)) {
      if (!isNil(descriptor.default)) {
        return isFunction(descriptor.default)
          ? descriptor.default(this.configFile.filename)
          : descriptor.default;
      }

      throw new Error(`[ConfigManager] missing ${descriptor.key} within one config file`);
    }

    // 值转换
    const configValue = isNil(descriptor.transform)
      ? originalConfigValue
      : descriptor.transform({
          rcfile: this.configFile.filename,
          value: originalConfigValue,
        });

    // 校验入参
    Joi.assert(configValue, descriptor.schema);

    return configValue;
  }
}
