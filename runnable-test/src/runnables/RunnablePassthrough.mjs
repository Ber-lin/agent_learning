/*
 * @Author: Adrian 1529366751@qq.com
 * @Date: 2026-05-10 20:10:45
 * @LastEditors: Adrian 1529366751@qq.com
 * @LastEditTime: 2026-05-10 20:26:10
 * @FilePath: /agent_learning/runnable-test/src/runnables/RunnablePassthrough.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "dotenv/config";
import {
  RunnablePassthrough,
  RunnableLambda,
  RunnableSequence,
  RunnableMap,
} from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  RunnableLambda.from((input) => ({ concept: input })),
  RunnableMap.from({
    original: new RunnablePassthrough(),
    processed: RunnableLambda.from((obj) => ({
      concept: input,
      upper: obj.concept.toUpperCase(),
      length: obj.concept.length,
    })),
    assign: RunnablePassthrough.assign({
      original: new RunnablePassthrough(),
      processed: (obj) => ({
        concept: input,
        upper: obj.concept.toUpperCase(),
        length: obj.concept.length,
      }),
    }),
  }),
]);

const input = "神说要有光";
const result = await chain.invoke(input);
console.log(result);
