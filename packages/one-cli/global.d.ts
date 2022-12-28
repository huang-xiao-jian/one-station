export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 命令行读取 .env.${extra} 配置环境变量
      ONE_EXTRA_ENV?: string;
    }
  }
}
