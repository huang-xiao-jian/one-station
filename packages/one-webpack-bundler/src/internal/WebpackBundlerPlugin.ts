import type { WebpackBundler } from './WebpackBundler';

export interface WebpackBundlerPlugin {
  apply: (wb: WebpackBundler) => void;
}
