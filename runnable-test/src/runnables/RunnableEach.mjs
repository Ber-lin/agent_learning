/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 20:28:07
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 20:29:27
 * @FilePath: /agent_learning/runnable-test/src/runnables/RunnableEach.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "dotenv/config";
import {
  RunnableEach,
  RunnableLambda,
  RunnableSequence,
} from "@langchain/core/runnables";

const toUpperCase = RunnableLambda.from((input) => input.toUpperCase());
const addGreeting = RunnableLambda.from((input) => `你好，${input}！`);

const processItem = RunnableSequence.from([toUpperCase, addGreeting]);

// 使用 RunnableEach 对数组中的每个元素应用这个链
const chain = new RunnableEach({
  bound: processItem,
});

const input = ["alice", "bob", "carol"];
const result = await chain.invoke(input);

console.log("✅ RunnableEach - 数组元素处理:");
console.log("输入:", input);
console.log("输出:", result);
