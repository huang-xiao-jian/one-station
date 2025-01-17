import { WebpackBundler, WebpackBundlerPlugin } from '@one/webpack-bundler';
import { container } from 'webpack';

export class DesignablePalettePlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('DesignablePalettePlugin', async (wbc, wbi) => {
      wbc.hooks.adjustment.tapPromise('DesignablePalettePluginAdjustment', async (chain) => {
        const root = wbi.config<string>('root');

        /**
         * 参数目前固定，考虑后续如何进行迭代
         */
        chain.plugin('ModuleFederationPlugin').use(container.ModuleFederationPlugin, [
          {
            /**
             * 导出全局变量保持固定，除非未来允许多租户并发加载
             */
            name: 'zmart_tenant',
            /**
             * 基于子目录区分租户，标准化导出文件名
             */
            filename: 'mf-entry.js',
            library: { type: 'window', name: 'zmart_tenant' },
            exposes: {
              // './components': './src/components/index.ts',
              './materials': './src/materials/index.ts',
            },
            shared: {
              react: {
                singleton: true,
                requiredVersion: '^17.0.0',
              },
              'react-dom': {
                singleton: true,
                requiredVersion: '^17.0.0',
              },
              '@formily/core': { singleton: true, requiredVersion: '^2.2.10' },
              '@formily/react': { singleton: true, requiredVersion: '^2.2.10' },
              '@formily/reactive': { singleton: true, requiredVersion: '^2.2.10' },
              '@designable/core': { singleton: true, requiredVersion: '1.0.0-beta.45' },
              '@designable/formily-setters': { singleton: true, requiredVersion: '1.0.0-beta.45' },
              '@designable/formily-transformer': {
                singleton: true,
                requiredVersion: '1.0.0-beta.45',
              },
              '@designable/react': { singleton: true, requiredVersion: '1.0.0-beta.45' },
              '@designable/react-settings-form': {
                singleton: true,
                requiredVersion: '1.0.0-beta.45',
              },
              '@designable/shared': { singleton: true, requiredVersion: '1.0.0-beta.45' },
            },
          },
        ]);
      });
    });
  }
}
