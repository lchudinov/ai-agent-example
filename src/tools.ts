import { Tool } from "./tool.js";

export class DateTool implements Tool {
  readonly name = "getCurrentDate";
  readonly description = "Returns the current date and time in the ISO format.";
  async execute(): Promise<string> {
    console.log(`Date Tool called`);
    return new Date().toISOString();
  }
}

export class TimeZoneTool implements Tool {
  readonly name = "getCurrentTimeZone";
  readonly description = "Returns the current time zone.";
  async execute(): Promise<string> {
    console.log(`TimeZone Tool called`);
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export class UserTool implements Tool {
  readonly name = "getCurrentUser";
  readonly description = "Returns the current user name.";
  async execute(): Promise<string> {
    console.log(`User Tool called`);
    return 'Иван';
  }
}