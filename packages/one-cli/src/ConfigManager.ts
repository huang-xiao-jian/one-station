import { Injectable } from 'injection-js';
import { cosmiconfig } from 'cosmiconfig';
import Joi from 'joi';
import assert from 'assert';
import { isNil } from 'lodash';
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
export class ConfigManager {
  /**
   * 内部配置文件链接
   */
  private configFile: OneConfigFile | null = null;

  constructor(private readonly pivotRegistry: PivotRegistry) {}

  /**
   * 加载用户配置文件，未声明配置文件，直接抛出错误
   */
  async loadConfigFile() {
    const discovery = await EXPLORER.search();

    assert.ok(discovery, 'must provide related config file');

    const configResult = await EXPLORER.load(discovery.filepath);
    const configuration = configResult?.config;

    assert.ok(configuration, `must provide useful configuration within config file`);

    this.configFile = {
      filename: discovery.filepath,
      configuration,
    };
  }

  /**
   * 用户配置文件校验
   * 常规插件体系差异：只校验插件声明待消费属性，忽略未声明属性校验
   */
  async validateConfigFile() {}

  /**
   * 生成者模型，为插件体系声明属性访问控制
   */
  async consumeConfigProperty(key: string) {
    const configFile = this.configFile;

    assert.ok(configFile, `[ConfigManager] config file not initialized!!`);

    const descriptor = this.pivotRegistry.provideConfig(key);
    const configValue = configFile.configuration[key];

    if (isNil(configValue)) {
      if (!isNil(descriptor.default)) {
        return descriptor.default;
      }

      throw new Error(`missing ${descriptor.key} within one config file`);
    }

    // 值转换
    const latestConfigValue = isNil(descriptor.transform)
      ? configValue
      : descriptor.transform({
          rcfile: configFile.filename,
          value: configValue,
        });

    // 校验入参
    Joi.assert(latestConfigValue, descriptor.schema);
  }
}
