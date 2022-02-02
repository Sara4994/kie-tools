/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import SwaggerParser from "@apidevtools/swagger-parser";
import { FunctionDefinition, ServiceDefinition, ServiceType } from "../src";

export const getServiceDefinitionList = (): Promise<ServiceDefinition[]> => {
  return Promise.resolve([
    {
      name: "api",
      path: "./specs/openapi.yaml",
      type: ServiceType.rest,
    },
    {
      name: "multiplication",
      path: "./specs/multiplication.yaml",
      type: ServiceType.rest,
    },
    {
      name: "subtraction",
      path: "./specs/subtraction.yaml",
      type: ServiceType.rest,
    },
  ]);
};

export const getFunctionDefinitionList = (path: string): Promise<FunctionDefinition[]> => {
  return new Promise((resolve, reject) => {
    SwaggerParser.parse(`${path}`)
      .then((response) => {
        const functionDefinitionObjs: any = [];
        const paths = response.paths;
        const components = response.components;

        Object.getOwnPropertyNames(paths).forEach((url) => {
          if (Object.prototype.hasOwnProperty.call(paths[`${url}`], "post")) {
            functionDefinitionObjs.push({ [url]: paths[url].post });
          }
        });

        resolve(createFunctionDefinitionList(functionDefinitionObjs, components, path));
      })
      .catch((err) => reject(err));
  });
};

export const createFunctionDefinitionList = (
  functionDefinitionObjs: any,
  components: any,
  path: string
): FunctionDefinition[] => {
  const functionDefinitionList: FunctionDefinition[] = [] as FunctionDefinition[];

  functionDefinitionObjs.forEach((processDefObj: any) => {
    const functionDefinition: FunctionDefinition = {} as FunctionDefinition;
    const obj: any = processDefObj[Object.keys(processDefObj)[0]];
    const functionName: string = Object.keys(processDefObj)[0].replace(/^\/+/, "");

    functionDefinition.name = obj.hasOwnProperty("operationId") ? obj.operationId : functionName;
    functionDefinition.operation = obj.hasOwnProperty("operationId")
      ? `${path}#${obj.operationId}`
      : `${path}#${functionName}`;
    const content = (obj?.requestBody || {}).content;
    const ref = content && content[`${Object.keys(content)[0]}`]["schema"]["$ref"]?.split("/").pop();

    let funcArguments: any = {};

    if (ref) {
      funcArguments = components?.schemas[`${ref}`];

      functionDefinition.arguments = funcArguments.properties || {};
      functionDefinition.type = ServiceType.rest;
    }
    functionDefinitionList.push(functionDefinition);
  });

  return functionDefinitionList;
};
