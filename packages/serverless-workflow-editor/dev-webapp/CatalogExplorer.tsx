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
} from "@patternfly/react-core";

const CatalogExplorer = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [expanded, setExpanded] = useState("");
  const data = JSON.parse(localStorage.getItem("services") || "[]");
  const handleClick = () => {
    setDisplayMenu(!displayMenu);
  };

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };
  console.log("data", data);
  const renderAccordionItem = () => {
    if (data.length === 0 || data?.services?.length === 0) {
      return <MenuItem isDisabled>No service</MenuItem>;
    } else {
      return (
        <Accordion asDefinitionList>
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
                  <MenuItem isDisabled>Lorem ipsum dolor sit amet</MenuItem>
                  <MenuItem isDisabled>Lorem ipsum dolor sit amet</MenuItem>
                  <MenuItem isDisabled>Lorem ipsum dolor sit amet</MenuItem>
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
            <MenuList>
              {renderAccordionItem()}
              {/* <AccordionItem>
                                    <AccordionToggle
                                        onClick={() => {
                                            onToggle('ex-toggle1');
                                        }}
                                        isExpanded={expanded === 'ex-toggle1'}
                                        id="ex-toggle1"
                                    >
                                        Item one
                                    </AccordionToggle>
                                    <AccordionContent id="ex-expand1" isHidden={expanded !== 'ex-toggle1'}>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                            dolore magna aliqua.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionToggle
                                        onClick={() => {
                                            onToggle('ex-toggle1');
                                        }}
                                        isExpanded={expanded === 'ex-toggle1'}
                                        id="ex-toggle1"
                                    >
                                        Item one
                                    </AccordionToggle>
                                    <AccordionContent id="ex-expand1" isHidden={expanded !== 'ex-toggle1'}>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                            dolore magna aliqua.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionToggle
                                        onClick={() => {
                                            onToggle('ex-toggle1');
                                        }}
                                        isExpanded={expanded === 'ex-toggle1'}
                                        id="ex-toggle1"
                                    >
                                        Item one
                                    </AccordionToggle>
                                    <AccordionContent id="ex-expand1" isHidden={expanded !== 'ex-toggle1'}>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                            dolore magna aliqua.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionToggle
                                        onClick={() => {
                                            onToggle('ex-toggle1');
                                        }}
                                        isExpanded={expanded === 'ex-toggle1'}
                                        id="ex-toggle1"
                                    >
                                        Item one
                                    </AccordionToggle>
                                    <AccordionContent id="ex-expand1" isHidden={expanded !== 'ex-toggle1'}>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                            dolore magna aliqua.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem> */}
            </MenuList>
          </MenuContent>
        </Menu>
      )}
    </>
  );
};

export default CatalogExplorer;
