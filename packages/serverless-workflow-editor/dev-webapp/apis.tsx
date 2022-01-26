import SwaggerParser from "@apidevtools/swagger-parser";
import { FunctionDefinition } from "./types";

export const getFunctionDefinitionList = (): Promise<FunctionDefinition[]> => {
  return new Promise((resolve, reject) => {
    SwaggerParser.parse("./openapi.yaml")
      .then((response) => {
        const functionDefinitionObjs: any = [];
        const paths = response.paths;
        const components = response.components;

        Object.getOwnPropertyNames(paths).forEach((url) => {
          if (Object.prototype.hasOwnProperty.call(paths[`${url}`], "post")) {
            functionDefinitionObjs.push({ [url]: paths[url].post });
          }
        });
        console.log("urls", functionDefinitionObjs);
        resolve(createFunctionDefinitionList(functionDefinitionObjs, components));
      })
      .catch((err) => reject(err));
  });
};

export const createFunctionDefinitionList = (functionDefinitionObjs: any, components: any): FunctionDefinition[] => {
  const functionDefinitionList: FunctionDefinition[] = [] as FunctionDefinition[];

  functionDefinitionObjs.forEach((processDefObj: any) => {
    const functionDefinition: FunctionDefinition = {} as FunctionDefinition;
    const obj: any = processDefObj[Object.keys(processDefObj)[0]];
    functionDefinition.name = obj.hasOwnProperty("operationId") ? obj.operationId : Object.keys(processDefObj)[0];
    functionDefinition.operation = obj.hasOwnProperty("operationId")
      ? `${Object.keys(processDefObj)[0]}#${obj.operationId}`
      : `${Object.keys(processDefObj)[0]}`;
    const content = (obj?.requestBody || {}).content;
    const ref = content && content[`${Object.keys(content)[0]}`]["schema"]["$ref"]?.split("/").pop();
    let funcArguments: any = {};
    if (ref) {
      funcArguments = components?.schemas[`${ref}`];
      console.log("f", funcArguments);
      functionDefinition.arguments = funcArguments.properties || {};
      functionDefinition.type = funcArguments.type;
    }
    functionDefinitionList.push(functionDefinition);
  });
  console.log("check", functionDefinitionList);
  return functionDefinitionList;
};
