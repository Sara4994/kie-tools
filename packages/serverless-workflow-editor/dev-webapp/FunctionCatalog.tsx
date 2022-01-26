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

  const handleClick = (): void => {
    setDisplayMenu(!displayMenu);
  };

  const initLoad = async (): Promise<void> => {
    const tempList: FunctionDefinition[] = await getFunctionDefinitionList();
    console.log("tempList", tempList, typeof tempList);
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
  //   console.log("data", data);
  const renderAccordionItem = (): JSX.Element => {
    if (data.length === 0 || data?.services?.length === 0) {
      return <MenuItem isDisabled>No service</MenuItem>;
    } else {
      return (
        <Accordion asDefinitionList style={{ width: "250px" }}>
          {data?.services?.map((service: any) => {
            return (
              <AccordionItem>
                <AccordionToggle
                  onClick={() => {
                    onToggle(service.name);
                  }}
                  isExpanded={expanded === service.name}
                  id={service.name}
                >
                  {service.name}
                </AccordionToggle>
                <AccordionContent id={service.name} isHidden={expanded !== service.name}>
                  {functionList &&
                    functionList.map((list: FunctionDefinition, index: number) => (
                      <Tooltip content={<div>{list.name}</div>}>
                        <MenuItem key={index} onClick={handleClick}>
                          {list.name}
                        </MenuItem>
                      </Tooltip>
                    ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
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
