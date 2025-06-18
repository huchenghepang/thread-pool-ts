import { Worker } from 'worker_threads';

export function createWorker<T, R>(workerPath: string, task: T, index: number, timeout = 0): Promise<{ result: R; index: number }> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, { workerData: task });

        const timer = timeout > 0 ? setTimeout(() => {
            worker.terminate();
            reject(new Error(`Worker ${index} timed out after ${timeout}ms`));
        }, timeout) : null;

        worker.on('message', (message) => {
            if (timer) clearTimeout(timer);
            resolve({ result: message, index });
        });

        worker.on('error', (err) => {
            if (timer) clearTimeout(timer);
            reject(err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
    });
}