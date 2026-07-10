import { Tool } from "./tool.js";
import { runLLM } from "./llm.js";


export class Agent {

  constructor(
    private tools: Tool[]
  ) { }

  async run(question: string) {

    const messages = [
      {
        role: "system" as const,
        content:
          `
You are a software engineering assistant.

Use tools when needed.
Do not invent information.
`
      },
      {
        role: "user" as const,
        content: question
      }
    ];


    const answer = await runLLM(
      messages,
      this.tools
    );


    return answer;

  }

}