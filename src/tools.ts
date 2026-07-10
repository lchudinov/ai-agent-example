import { Tool } from "./tool.js";

export class DateTool implements Tool {
  readonly name = "getCurrentDate";
  readonly description = "Returns the current date and time.";
  async execute(): Promise<string> {
    console.log(`Date Tool called`);
    return new Date().toISOString();
  }

}