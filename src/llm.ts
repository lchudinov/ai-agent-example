import { Tool } from "./tool.js";
import { OpenRouter, } from '@openrouter/sdk';
import { ChatMessages } from "@openrouter/sdk/models";

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function runLLM(
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
  const response_1 = completion.choices[0].message;
  messages.push(response_1);
  const { toolCalls } = response_1;
  if (toolCalls) {
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const tool = tools.find(t => t.name === toolName);
      if (!tool) {
        console.log(`tool ${toolName} not found`);
        return response_1;
      }
      //const { search_params } = JSON.parse(toolCall.function.arguments);
      const toolResponse = await tool.execute({});
      messages.push({
        role: 'tool',
        toolCallId: toolCall.id,
        content: JSON.stringify(toolResponse),
      });
    }
    const response_2 = await openRouter.chat.send({
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
    return response_2.choices[0].message;
  }
}
