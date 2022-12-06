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

export interface AssembleOption {
  tasks: AssembleTask[];
}
