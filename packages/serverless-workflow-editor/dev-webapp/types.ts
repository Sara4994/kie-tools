export interface FunctionDefinition {
  name: string;
  operation: string;
  arguments: Object;
  type: ArgumentType;
}

export enum ArgumentType {
  Object = "Object",
  Array = "Array",
}

export interface ServiceDefinition {
  name: string;
  url: string;
  type: string;
}
