/**
 * Worker 接收到的任务格式（内部结构）
 */
export type WorkerTask<T = any, R = any> = {
    /** 实际传递的任务数据 */
    data: T;
    /** 当前任务的序号（由线程池赋值） */
    index: number;
};

/**
 * 线程池初始化配置
 */
export interface ThreadPoolOptions {
    /** Worker 文件路径 */
    workerPath: string;

    /** 最大并发数（默认 4） */
    maxConcurrency?: number;

    /** 是否按顺序触发 onResult（默认 false） */
    isSequential?: boolean;

    /** 每个任务的超时时间（单位 ms，默认 0 表示不超时） */
    timeout?: number;

    /** 是否启用线程复用（预留字段） */
    enableReuse?: boolean;
}


/**
 * 线程池任务运行参数
 */
export interface RunOptions<T, R> {
    /** 待处理任务数组 */
    tasks: T[];

    /** 每个任务处理完成后触发（可选） */
    onResult?: (result: R, index: number) => void;

    /** 所有任务完成后触发（可选） */
    onComplete?: (results: R[]) => void;

    /** 是否收集每个任务的结果（默认 true） */
    isNeedResult?: boolean;
}



