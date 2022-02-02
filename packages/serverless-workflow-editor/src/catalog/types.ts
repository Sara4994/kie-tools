export interface FunctionDefinition {
  name: string;
  operation: string;
  arguments: Record<string, any>;
  type: ServiceType;
}

export enum ServiceType {
  rest = "rest",
  graphql = "graphql",
}

export interface ServiceDefinition {
  name: string;
  path: string;
  type: ServiceType;
}
