import { WebpackBundlerInjection } from './WebpackBundlerInjection';

export interface WebpackBundlerAvailableService {
  injection: WebpackBundlerInjection;
}

export class WebpackBundlerService {
  request<T extends string>(
    name: T,
  ): T extends keyof WebpackBundlerAvailableService ? WebpackBundlerAvailableService[T] : never {
    throw new Error('');
  }
}
