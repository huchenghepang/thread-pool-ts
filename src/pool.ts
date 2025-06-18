import { RunOptions, ThreadPoolOptions } from "./types";
import { createWorker } from "./worker-wrapper";

export class ThreadPool {
    private workerPath: string;
    private maxConcurrency: number;
    private timeout: number;
    private isSequential: boolean;

    constructor(options: ThreadPoolOptions) {
        this.workerPath = options.workerPath;
        this.maxConcurrency = options.maxConcurrency ?? 4;
        this.timeout = options.timeout ?? 0;
        this.isSequential = options.isSequential ?? false;
    }

    async run<T, R>({
        tasks,
        onResult,
        onComplete,
        isNeedResult = true,
    }: RunOptions<T, R>): Promise<R[]> {
        const results: R[] = [];
        let currentIndex = 0;
        let currentExecuteResult = 0;

        // 缓存乱序的回调
        const resultQueue = new Map<number, R>();

        // 控制并发的Promise数组
        const workers: Promise<void>[] = [];

        const runTask = async (taskIndex: number) => {
            try {
                const { result, index } = await createWorker<T, R>(
                    this.workerPath,
                    tasks[taskIndex],
                    taskIndex,
                    this.timeout,
                );
                if (isNeedResult) {
                    results[index] = result;
                }

                if (this.isSequential && onResult) {
                    // 如果是顺序执行，缓存结果
                    resultQueue.set(index, result);

                    // 尝试执行按顺序的回调
                    while (resultQueue.has(currentExecuteResult)) {
                        const res = resultQueue.get(currentExecuteResult)!;
                        onResult(res, currentExecuteResult);
                        resultQueue.delete(currentExecuteResult);
                        currentExecuteResult++;
                    }
                } else {
                    // 非顺序模式，直接执行回调
                    onResult && onResult(result, index);
                }
            } catch (error) {
                console.error(`Worker ${taskIndex} failed:`, error);
            }
        };

        // 启动初始任务
        const initialCount = Math.min(this.maxConcurrency, tasks.length);
        for (let i = 0; i < initialCount; i++) {
            workers.push(runNext());
        }

        // 控制任务分发
        async function runNext() {
            if (currentIndex >= tasks.length) return;
            const taskIndex = currentIndex++;
            await runTask(taskIndex);
            await runNext();
        }

        await Promise.all(workers);

        onComplete && onComplete(results);
        return results;
    }
}
