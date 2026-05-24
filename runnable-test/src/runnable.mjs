/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 19:44:30
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 19:59:07
 * @FilePath: /agent_learning/runnable-test/runnable.mjs
 * @Description: 实现了 Runnable api 后，就可以声明式的组合执行的 chain，然后统一执行。
 *  这种声明式的写法叫做 LCEL（Lang Chain Expression Language，LangChain 表达式语言）LCEL 就是实现了 Runnbale 接口的一些 api 组合成 chain，然后统一执行。
 */
import "dotenv/config";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 定义输出结构 schema
const schema = z.object({
  translation: z.string().describe("翻译后的英文文本"),
  keywords: z.array(z.string()).length(3).describe("3个关键词"),
});

const outputParser = StructuredOutputParser.fromZodSchema(schema);

const promptTemplate = PromptTemplate.fromTemplate(
  "将以下文本翻译成英文，然后总结为3个关键词。\n\n文本：{text}\n\n{format_instructions}"
);

// const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
const chain = promptTemplate.pipe(model).pipe(outputParser);
const input = {
  text: "LangChain 是一个强大的 AI 应用开发框架",
  format_instructions: outputParser.getFormatInstructions(),
};

const result = await chain.invoke(input);

console.log("✅ 最终结果:");
console.log(result);
