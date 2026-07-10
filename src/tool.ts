export interface Tool {
  readonly name: string;
  readonly description: string;
  execute(args: unknown): Promise<string>;
}