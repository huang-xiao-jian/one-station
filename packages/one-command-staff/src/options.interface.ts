/**
 * 命令行传参
 */
export interface StaffInlineOptions {
  watch?: boolean;
}

/**
 * 路径皆相对于配置文件的相对文件
 */
export interface StaffProvider {
  /**
   * monorepo 直接容器目录
   */
  workspace: string;
  /**
   * 子项目工作目录路径
   */
  directory: string;
  /**
   * 子项目静态访问前缀
   */
  publicPath: string;
}
