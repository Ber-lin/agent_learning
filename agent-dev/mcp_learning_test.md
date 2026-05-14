# 🤖 Agent 与 MCP 开发学习自测题

根据你在 `agent-dev` 项目中的实际代码实现（包含 `mcp-server.mjs`, `langchain-mcp.mjs`, `mcp-test.mjs`, `mini-cursor.mjs` 等），我为你总结了以下测试题。这些题目紧贴你写过的代码，旨在检验你对大模型调用底层逻辑、MCP规范细节以及 Agent 工程健壮性的真正理解。

---

## 一、 MCP 核心概念与 Server 端实现 (`mcp-server.mjs`)

1. **Tool 与 Resource 的根本差异**：
   你在 `mcp-server.mjs` 中同时注册了 `query_user` (Tool) 和 `docs://guide` (Resource)。从协议设计和 Agent 会话角度来看，Tool 和 Resource 的核心区别是什么？它们在与大语言模型交互的生命周期中，各自主要是如何被使用的？

2. **Transport（传输层）的选择与原理**：
   你的服务采用了 `StdioServerTransport`。
   * 这种基于标准输入输出的通信方式，在其实现原理上有什么特点？
   * 如果有一天你想让你写的这个 MCP Server 提供给局域网内的另一台电脑（比如你同事的本地 Agent）调用，你需要改用什么 Transport（例如 SSE）？在代码层面最大的改动是什么？

---

## 二、 Client 适配与 Agent 执行循环 (`langchain-mcp.mjs`, `mcp-test.mjs`)

3. **静态资源加载引发的上下文瓶颈**：
   在 `langchain-mcp.mjs` 中，你的逻辑是通过 `mcpClient.listResources()` 和 `readResource` 把所有资源读出来，拼接到 `resourceText` 里，然后塞给 `new SystemMessage()`。
   * 假设你的 MCP Server 连接了一个有 10 万篇文档的企业知识库，你当前的实现会导致系统发生什么问题？
   * 为了解决这种动态或海量上下文按需加载的问题，你可以如何重构现有的逻辑（提示：思考 MCP 的 Prompt Template 或让 Agent 按需调用 Tool 去读 Resource）？

4. **Agent Tool Loop (工具调用循环) 的严密性与优化**：
   在实现 Agent 心智循环时，你遍历了 `response.tool_calls`（如下所示）：
   ```javascript
   for (const toolCall of response.tool_calls) { ... messages.push(new ToolMessage({ content: toolResult, tool_call_id: toolCall.id })) }
   ```
   * **严密性**：为什么 `ToolMessage` 必须指定明确的 `tool_call_id` 属性？如果这个 ID 和大模型下发的 ID 对应不上或是不传，OpenAI 的接口会报什么错？
   * **性能优化**：目前你使用了 `for...of` 和 await，这会导致工具串行执行（一个接一个地运行）。如果你赋予了 AI 一次性查询 3 个地方天气的工具调用，如何将这里的代码从串行优化成“并发执行（Parallel Execution）”？

---

## 三、 自定义工具开发与防御性编程 (`mini-cursor.mjs`)

5. **Prompt Engineering vs 代码层防御**：
   在 `mini-cursor.mjs` 的 System Prompt 中，你写了很长一段“耳提面命”的话：
   > *“当使用 workingDirectory 时，绝对不要在 command 中使用 cd...”* 并给出了正误示例。
   在生产环境中，大模型有时依然会犯错（Prompt 容易失效）。你能否思考：如果不依赖系统提示词，如何在你的 `executeCommandTool` 源码中（比如通过修改 Zod inputSchema，或者在拿到 command 参数后进行字符串/正则拦截）从根本上彻底杜绝 AI 使用 `cd` 命令？

6. **对话历史无脑膨胀问题 (Memory Management)**：
   你的 Agent 目前在每次迭代中都持续把结果加到上下文：`messages.push(response)`，并把长文本 `toolResult` 推送给上下文。
   * 如果 Agent 运行了 20 步，期间 `list_directory` 返回了上万行代码结构，会导致什么灾难级后果？
   * 如果不使用完整的 LangGraph 等框架，你觉得在现有的 `while/for` 结构里，可以加入什么简易策略来控制 `messages` 数组占用过大的 Token？

---

## 四、 综合工程与生态对比

7. **原生 Tool 与 MCP 工具的对比**：
   在 `mini-cursor.mjs` 中，你手写了原生的 Langchain tool (`read_file`, `write_file` 等)。而在 `mcp-test.mjs` 中，你通过 `filesystem` Server（也就是 `@modelcontextprotocol/server-filesystem`）获得了文件读写能力。
   * 既然 LangChain 自身就能随便用 JavaScript 注入任何工具函数，为什么现在整个行业还要大力推行 MCP 抽象？开发独立的纯 MCP Server 处理文件，比直接在 LangChain Node.js 进程里 `fs.writeFileSync`，有哪些核心架构优势（请至少列出 2 点）？
