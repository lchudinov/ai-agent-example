import "dotenv/config";

import { Agent } from "./agent.js";
import { DateTool, TimeZoneTool, UserTool } from "./tools.js";
import { inspect } from "node:util";

const agent = new Agent([
  new DateTool(),
  new TimeZoneTool(),
  new UserTool(),
]);

const result = await agent.run(
  "Какой сегодня день и время в моем временном поясе? и как меня зовут?"
);


console.log(inspect(result));