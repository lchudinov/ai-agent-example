import OpenAI from "openai";
import { Tool } from "./tool.js";
import { OpenRouter,  } from '@openrouter/sdk';
import { ChatMessages } from "@openrouter/sdk/models";

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function runLLM(
  messages: ChatMessages[],
  tools: Tool[]
) {

  const completion = await openRouter.chat.send({chatRequest: {
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
  return completion.choices[0].message;

}