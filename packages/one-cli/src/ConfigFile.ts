import assert from 'assert';
import { cosmiconfig } from 'cosmiconfig';
import { InjectionToken, ValueProvider } from 'injection-js';
import { isArray } from 'lodash';

export interface ConfigFile {
  /**
   * 配置文件绝对路径，插件配置相对路径转换绝对路径
   */
  filename: string;
  /**
   * 实际配置文件
   * TODO - 精细化类型声明，方便后续插件扩展
   */
  configuration: Record<string, any>;
}

export const ConfigFileToken = new InjectionToken<ConfigFile>('ConfigFile');

export async function createConfigFileProvider(): Promise<ValueProvider> {
  const explorer = cosmiconfig('one', {
    searchPlaces: [`package.json`, `.onerc`, `.onerc.yml`, `.onerc.json`],
  });

  const discovery = await explorer.search();

  assert.ok(discovery, '[ConfigFileProvider] explicit config file required');

  const configResult = await explorer.load(discovery.filepath);
  const configuration = configResult?.config;

  assert.ok(
    configuration,
    `[ConfigFileProvider] must provide useful configuration within config file`,
  );

  // 插件声明为强制，否则不具备任何功能
  const plugins = configuration['plugins'];

  assert.ok(isArray(plugins), `[ConfigFileProvider] plugin property required within config file`);

  return {
    provide: ConfigFileToken,
    useValue: {
      filename: discovery.filepath,
      configuration,
    },
  };
}
