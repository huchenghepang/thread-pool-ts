import path from 'path';
import { ThreadPool } from '../src/pool';

async function main() {
    const workerPath = path.resolve(__dirname, '../dist/example/worker.js'); // 编译后的 js 文件路径
    const pool = new ThreadPool({
        workerPath,
        maxConcurrency: 2,
        isSequential: true, // 是否顺序输出
        timeout: 5000,
    });



    const tasks = [1, 2, 3, 4, 5];
    const results = await pool.run({
        tasks,
        onResult: (result, index) => {
            console.log(`Task ${index} result:`, result);
        },
        onComplete: (results) => {
            console.log('All tasks completed. Results:', results);
        }
    });

    console.log('Final results:', results);
}

main().catch(console.error);
