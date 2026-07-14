import { Tool } from "./tool.js";
import { OpenRouter, } from '@openrouter/sdk';
import { ChatMessages } from "@openrouter/sdk/models";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

const proxyAgent = new SocksProxyAgent(
  "socks5://127.0.0.1:1080"
);

async function streamToBuffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export const httpClient = {
  async request(request: any) {
    let data = request.body;

    if (data instanceof ReadableStream) {
      data = await streamToBuffer(data);
    }

    const response = await axios.request({
      url: request.url,
      method: request.method,
      headers: request.headers,
      data,

      httpAgent: proxyAgent,
      httpsAgent: proxyAgent,

      responseType: "arraybuffer"
    });

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.data
    };
  }
};

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  httpClient: httpClient as any,
});

export async function runLLM(
  messages: ChatMessages[],
  tools: Tool[]
) {
  for (let i = 0; i < 10; i++) {
    const response = await sendChatRequest(messages, tools);
    console.log(response);
    messages.push(response);
    const { toolCalls } = response;
    if (!toolCalls) {
      return response;
    }
    if (i > 9) {
      return response;
    }
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const tool = tools.find(t => t.name === toolName);
      if (!tool) {
        console.log(`tool ${toolName} not found`);
        return response;
      }
      //const { search_params } = JSON.parse(toolCall.function.arguments);
      const toolResponse = await tool.execute({});
      messages.push({
        role: 'tool',
        toolCallId: toolCall.id,
        content: JSON.stringify(toolResponse),
      });
    }
  }
}

async function sendChatRequest(
  messages: ChatMessages[],
  tools: Tool[]
) {

  const completion = await openRouter.chat.send({
    chatRequest: {
      model: 'openrouter/free',
      messages,
      tools: tools.map(tool => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: "object",
            properties: {},
            additionalProperties: true
          }
        }
      })),
      stream: false,
    }
  });
  const response = completion.choices[0].message;
  return response;
}
