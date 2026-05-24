/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 19:59:11
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 19:59:38
 * @FilePath: /agent_learning/runnable-test/src/runnables/RunnableMap.mjs
 * @Description: 通过 RunnableMap 可以并行执行多个 runnable，然后返回一个结果。
 */
import "dotenv/config";
import { RunnableMap, RunnableLambda } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

const addOne = RunnableLambda.from((input) => input.num + 1);
const multiplyTwo = RunnableLambda.from((input) => input.num * 2);
const square = RunnableLambda.from((input) => input.num * input.num);

const greetTemplate = PromptTemplate.fromTemplate("你好，{name}！");
const weatherTemplate = PromptTemplate.fromTemplate("今天天气{weather}。");

// 创建 RunnableMap，并行执行多个 runnable
const runnableMap = RunnableMap.from({
  // 数学运算
  add: addOne,
  multiply: multiplyTwo,
  square: square, // prompt 格式化
  greeting: greetTemplate,
  weather: weatherTemplate,
});

// 测试输入
const input = {
  name: "柏林",
  weather: "多云",
  num: 5,
};

// 执行 RunnableMap
const result = await runnableMap.invoke(input);
console.log(result);
