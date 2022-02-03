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
  MenuItemAction,
  Tooltip,
  Text,
  TextVariants,
  TextContent,
} from "@patternfly/react-core";
import { FunctionDefinition, ServiceDefinition, ServiceType } from "./types";
import { TimesIcon } from "@patternfly/react-icons";
import { SiOpenapiinitiative, SiGraphql } from "react-icons/si";

interface IOwnProps {
  getFunctionDefinitionList: (path: string) => Promise<FunctionDefinition[]>;
  getServiceDefinitionList: () => Promise<ServiceDefinition[]>;
  handleCatalogExplorer?: () => void;
}

export const CatalogExplorer: React.FC<IOwnProps> = ({
  getFunctionDefinitionList,
  getServiceDefinitionList,
  handleCatalogExplorer,
}) => {
  const [expanded, setExpanded] = useState<string>("");
  const [functionList, setFunctionList] = useState<FunctionDefinition[]>([]);
  const [serviceList, setServiceList] = useState<ServiceDefinition[]>([]);
  const [activeItem, setActiveItem] = useState<string>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const initLoad = async (): Promise<void> => {
    const tmpServiceList = await getServiceDefinitionList();
    setServiceList(tmpServiceList);
  };

  useEffect(() => {
    initLoad();
  }, []);

  const onToggle = async (id: string): Promise<void> => {
    if (id === expanded) {
      setFunctionList([]);
      setExpanded("");
    } else {
      const service: any = serviceList.find((list) => list.name === id);
      const tempList: FunctionDefinition[] = await getFunctionDefinitionList(service.path);
      setFunctionList(tempList);
      setExpanded(id);
    }
  };

  const onSelect = (event: React.MouseEvent<Element, MouseEvent>, itemId: string): void => {
    if (selectedItems.indexOf(itemId) !== -1) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const renderTitle = (type: ServiceType, name: string): JSX.Element => {
    if (type === "rest") {
      return (
        <React.Fragment>
          <span style={{ marginRight: "8px" }}>
            <SiOpenapiinitiative />
          </span>
          <span>{name}</span>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <span style={{ marginRight: "8px" }}>
            <SiGraphql />
          </span>
          <span>{name}</span>
        </React.Fragment>
      );
    }
  };

  const renderAccordionItem = (): JSX.Element => {
    if (serviceList.length === 0) {
      return (
        <MenuItem isDisabled style={{ width: "250px" }}>
          No service
        </MenuItem>
      );
    } else {
      return (
        <Accordion asDefinitionList style={{ width: "250px" }}>
          {serviceList &&
            serviceList.map((service: ServiceDefinition, index: number) => (
              <AccordionItem key={index}>
                <AccordionToggle
                  onClick={() => {
                    onToggle(service.name);
                  }}
                  isExpanded={expanded === service.name}
                  id={service.name}
                >
                  {renderTitle(service.type, service.name)}
                </AccordionToggle>
                <AccordionContent
                  id={service.name}
                  isHidden={expanded !== service.name}
                  isCustomContent
                  style={{ maxHeight: "350px", overflowY: "auto" }}
                >
                  <Menu activeItemId={activeItem} onSelect={onSelect} selected={selectedItems}>
                    <MenuContent>
                      <MenuList>
                        {functionList &&
                          functionList.map((list: FunctionDefinition, index: number) => (
                            <Tooltip content={<div>{list.name}</div>} key={index}>
                              <MenuItem key={index} itemId={list.name}>
                                {list.name}
                              </MenuItem>
                            </Tooltip>
                          ))}
                      </MenuList>
                    </MenuContent>
                  </Menu>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      );
    }
  };

  return (
    <>
      <Menu style={{ position: "absolute" }}>
        <MenuContent>
          <MenuList>
            <Button variant="link" isAriaDisabled style={{ top: "3px" }}>
              Functions
            </Button>
            <MenuItemAction
              icon={<TimesIcon aria-hidden />}
              actionId="code"
              onClick={handleCatalogExplorer}
              aria-label="Code"
              style={{ float: "right" }}
            />
          </MenuList>
          <MenuList>{renderAccordionItem()}</MenuList>
        </MenuContent>
      </Menu>
    </>
  );
};
