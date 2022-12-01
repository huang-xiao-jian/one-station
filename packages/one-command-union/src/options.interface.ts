/**
 * 路径皆相对于配置文件的相对文件
 */
export interface UnionTask {
  /**
   * 聚合仓库访问地址
   */
  repo: string;
}

export interface UnionOption {
  tasks: UnionTask[];
}
