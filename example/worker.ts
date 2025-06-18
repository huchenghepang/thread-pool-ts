import { parentPort, workerData } from 'worker_threads';

function doWork(data: number): number {
    console.log('workerData', data);
    // 模拟计算，比如返回平方
    return data * data;
}

if (parentPort) {
    const result = doWork(workerData);
    parentPort.postMessage(result);
}
