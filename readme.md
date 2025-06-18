### 🧵 ThreadPool - Node.js 多线程任务池

基于 `worker_threads` 封装的轻量级线程池，支持：

- 多任务并发执行（限制最大并发）
- 支持顺序回调（按任务 index 顺序）
- 支持任务超时控制
- 支持任务完成后的钩子函数（onComplete）
- 任务结果收集（可选）

---

#### 📦 安装

```bash
npm install your-thread-pool
# or
pnpm add your-thread-pool
```

---

> ⚠️ 仅支持 Node.js 12+，不支持浏览器环境。

---

#### ✨ 快速使用

```ts
import { ThreadPool } from "thread-pool-ts";

const pool = new ThreadPool({
  workerPath: "./worker.js", // Worker 文件路径
  maxConcurrency: 4, // 最大并发数
  isSequential: true, // 是否按顺序执行 onResult
  timeout: 5000, // 每个任务超时时间（毫秒）
});

const tasks = ["任务1", "任务2", "任务3"];

pool.run<string, string>({
  tasks,
  onResult: (res, i) => {
    console.log(`第 ${i} 个结果:`, res);
  },
  onComplete: (allResults) => {
    console.log("所有任务完成:", allResults);
  },
});
```

---
