import { WebpackBundlerPlugin } from './WebpackBundlerPlugin';
import { BundleAnalyzePlugin } from './plugins/AnalyzePlugin';
import { AssetRulePlugin } from './plugins/AssetRulePlugin';
import { BrowserBaselinePlugin } from './plugins/BrowserBaseline/BrowserBaseline';
import { DesignablePalettePlugin } from './plugins/DesignablePalettePlugin';
import { MomentSmoothPlugin } from './plugins/MomentSmoothPlugin';
import { ProgressSmoothPlugin } from './plugins/ProgressSmoothPlugin';
import { ScriptRulePlugin } from './plugins/ScriptRulePlugin';
import { StylesheetPlugin } from './plugins/StylesheetPlugin';

export function collectPlugins(): WebpackBundlerPlugin[] {
  return [
    new BrowserBaselinePlugin(),
    new ScriptRulePlugin(),
    new StylesheetPlugin(),
    new AssetRulePlugin(),
    new BundleAnalyzePlugin(),
    new MomentSmoothPlugin(),
    new ProgressSmoothPlugin(),
    new DesignablePalettePlugin(),
  ];
}
