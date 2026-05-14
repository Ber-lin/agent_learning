/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-06 21:38:24
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-06 21:40:18
 * @FilePath: /agent_learning/output-parser-test/normal.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

// 初始化模型
const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 简单的问题，要求 JSON 格式返回
const question =
  "请介绍一下爱因斯坦的信息。请以 JSON 格式返回，包含以下字段：name（姓名）、birth_year（出生年份）、nationality（国籍）、major_achievements（主要成就，数组）、famous_theory（著名理论）。";

try {
  console.log("🤔 正在调用大模型...\n");

  const response = await model.invoke(question);

  console.log("✅ 收到响应:\n");
  console.log(response.content); // 解析 JSON

  const jsonResult = JSON.parse(response.content);
  console.log("\n📋 解析后的 JSON 对象:");
  console.log(jsonResult);
} catch (error) {
  console.error("❌ 错误:", error.message);
}
