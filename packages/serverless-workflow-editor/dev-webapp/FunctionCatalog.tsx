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

import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Button,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Tooltip,
} from "@patternfly/react-core";
import { getFunctionDefinitionList } from "./apis";
import { FunctionDefinition } from "./types";

const FunctionCatalog = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string>("");
  const [functionList, setFunctionList] = useState<FunctionDefinition[]>([]);
  const data = JSON.parse(localStorage.getItem("services") || "[]");
  const file = "openapi.yaml";
  const fileName = file.split(".")[0];

  const handleClick = (): void => {
    setDisplayMenu(!displayMenu);
  };

  const initLoad = async (): Promise<void> => {
    const tempList: FunctionDefinition[] = await getFunctionDefinitionList(file);

    setFunctionList(tempList);
  };
  React.useEffect(() => {
    initLoad();
  }, []);

  const onToggle = (id: string): void => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };

  const renderAccordionItem = (): JSX.Element => {
    if (fileName.length === 0) {
      return <MenuItem isDisabled>No service</MenuItem>;
    } else {
      return (
        <Accordion asDefinitionList style={{ width: "250px" }}>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle(fileName);
              }}
              isExpanded={expanded === fileName}
              id={fileName}
            >
              {fileName}
            </AccordionToggle>
            <AccordionContent
              id={fileName}
              isHidden={expanded !== fileName}
              style={{ height: "350px", overflowY: "scroll" }}
            >
              {functionList &&
                functionList.map((list: FunctionDefinition, index: number) => (
                  <Tooltip content={<div>{list.name}</div>} key={index}>
                    <MenuItem key={index} onClick={handleClick}>
                      {list.name}
                    </MenuItem>
                  </Tooltip>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick} ouiaId="catalog-button">
        Catalog Explorer
      </Button>
      {displayMenu && (
        <Menu>
          <MenuContent>
            <MenuList>{renderAccordionItem()}</MenuList>
          </MenuContent>
        </Menu>
      )}
    </>
  );
};

export default FunctionCatalog;
