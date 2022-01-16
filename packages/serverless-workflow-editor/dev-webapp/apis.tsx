import SwaggerParser from "@apidevtools/swagger-parser";

export const getProcessDefinitionList = () => {
  return new Promise((resolve, reject) => {
    SwaggerParser.parse("./openapi.yaml")
      .then((response) => {
        const processDefinitionObjs: any = [];
        const paths = response.paths;
        const regexPattern = /^\/[A-Za-z]+\/schema/;
        console.log("response", response);
        Object.getOwnPropertyNames(paths)
          .filter((path) => regexPattern.test(path.toString()))
          .forEach((url) => {
            let processArray = url.split("/");
            processArray = processArray.filter((name) => name.length !== 0);
            /* istanbul ignore else*/
            if (Object.prototype.hasOwnProperty.call(paths[`/${processArray[0]}`], "post")) {
              processDefinitionObjs.push({ [url]: paths[url] });
            }
          });
        resolve(createProcessDefinitionList(processDefinitionObjs, ""));
      })
      .catch((err) => reject(err));
  });
};

export const createProcessDefinitionList = (processDefinitionObjs: any, url: string) => {
  const processDefinitionList: any = [];
  processDefinitionObjs.forEach((processDefObj: any) => {
    const processName = Object.keys(processDefObj)[0].split("/")[1];
    const endpoint = `${url}/${processName}`;
    processDefinitionList.push({
      processName,
      endpoint,
    });
  });
  console.log("check", processDefinitionList);
  return processDefinitionList;
};
