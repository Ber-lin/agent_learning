/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 20:07:32
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 20:08:11
 * @FilePath: /agent_learning/runnable-test/src/runnables/RouterRunnable.mjs
 * @Description: 路由器示例
 */
import "dotenv/config";
import { RouterRunnable, RunnableLambda } from "@langchain/core/runnables";

// 创建两个简单的 RunnableLambda
const toUpperCase = RunnableLambda.from((text) => text.toUpperCase());
const reverseText = RunnableLambda.from((text) =>
  text.split("").reverse().join("")
);

// 创建 RouterRunnable，根据 key 选择要调用的 runnable
const router = new RouterRunnable({
  runnables: {
    toUpperCase,
    reverseText,
  },
});

// 测试：调用 reverseText
const result1 = await router.invoke({
  key: "reverseText",
  input: "Hello World",
});
console.log("reverseText 结果:", result1);

// 测试：调用 toUpperCase
const result2 = await router.invoke({
  key: "toUpperCase",
  input: "Hello World",
});
console.log("toUpperCase 结果:", result2);
