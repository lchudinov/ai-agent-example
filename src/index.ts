import "dotenv/config";

import { Agent } from "./agent.js";
import { DateTool } from "./tools.js";
import { inspect } from "node:util";


const agent = new Agent([
  new DateTool()
]);


const result = await agent.run(
  "Какая сегодня дата?"
);


console.log(inspect(result));