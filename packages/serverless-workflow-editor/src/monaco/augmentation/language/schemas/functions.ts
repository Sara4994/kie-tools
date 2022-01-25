/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const SW_SPEC_FUNCTIONS_SCHEMA = {
  $id: "https://serverlessworkflow.io/schemas/0.6/functions.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Serverless Workflow specification - functions schema",
  type: "object",
  functions: {
    oneOf: [
      {
        type: "string",
        format: "uri",
        description: "URI to a resource containing function definitions (json or yaml)",
      },
      {
        type: "array",
        description: "Workflow function definitions",
        items: {
          type: "object",
          $ref: "#/definitions/function",
        },
        additionalItems: false,
        minItems: 1,
      },
    ],
  },
  required: ["functions"],
  definitions: {
    function: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Unique function name",
          minLength: 1,
        },
        operation: {
          type: "string",
          description:
            "If type is `rest`, <path_to_openapi_definition>#<operation_id>. If type is `rpc`, <path_to_grpc_proto_file>#<service_name>#<service_method>. If type is `expression`, defines the workflow expression.",
          minLength: 1,
        },
        type: {
          type: "string",
          description: "Defines the function type. Is either `rest`, `rpc` or `expression`. Default is `rest`",
          enum: ["rest", "rpc", "expression"],
          default: "rest",
        },
      },
      additionalProperties: false,
      required: ["name", "operation"],
    },
  },
};