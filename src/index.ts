import "dotenv/config";

import { Agent } from "./agent.js";
import { DateTool } from "./tools.js";
import { inspect } from "node:util";


const agent = new Agent([
  new DateTool()
]);


const result = await agent.run(
  "Tell me the current date"
);


console.log(inspect(result));