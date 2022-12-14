/**
 * 命令行传参
 */
export interface AssembleInlineOptions {
  /**
   * 聚合产物前是否清理目录，默认 TRUE
   */
  clean: boolean;
  watch?: boolean;
}

/**
 * 路径皆相对于配置文件的相对文件
 */
export interface AssembleTask {
  /**
   * monorepo 直接容器目录
   */
  workspace: string;
  /**
   * 子项目工作目录路径
   */
  directory: string;
  /**
   * 子项目构建产出目录，前期约定为 dist 目录，不可变更
   */
  artifact: string;
  /**
   * 构建产物聚合分配路径
   */
  assignment: string;
}

/**
 * 内部执行者实际任务
 */
export interface AssembleTaskInternal {
  /**
   * 任务名称，用以输出提示信息
   */
  name: string;
  /**
   * 绝对路径，原始构建产物
   */
  source: string;
  /**
   * 绝对路径，目标复制地址
   */
  destiny: string;
}

export interface AssembleOption {
  tasks: AssembleTask[];
}
