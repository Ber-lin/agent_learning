/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 19:55:44
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 19:58:10
 * @FilePath: /agent_learning/runnable-test/src/runnables/RunnableLambda.mjs
 * @Description: 把普通对象通过 RunnableLambda 封装成了 Runnable 对象
 */
import "dotenv/config";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";

const addOne = RunnableLambda.from((input) => {
  console.log(`输入: ${input}`);
  return input + 1;
});

const multiplyTwo = RunnableLambda.from((input) => {
  console.log(`输入: ${input}`);
  return input * 2;
});

const chain = RunnableSequence.from([addOne, multiplyTwo, addOne]);

const result = await chain.invoke(5);
console.log(result);
