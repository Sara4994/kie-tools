import React, { useState } from "react";
import {
  Modal,
  ModalVariant,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { Table, TableHeader, TableBody } from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";
import { ServiceDefinition } from "./types";

interface IOwnProps {
  handleFormModalToggle: any;
}

interface ServiceMeta {
  services: ServiceDefinition[];
}
const CatalogTable: React.FC<IOwnProps> = ({ handleFormModalToggle }) => {
  const defaultData = JSON.parse(localStorage.getItem("services") || "[]");
  const [data, setData] = useState<ServiceMeta>(defaultData);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const columns: string[] = ["Name", "Url", "Type", ""];
  const [rows, setRows] = useState<any>([]);

  const switchModal = (): void => {
    setIsTableModalOpen(false);
    handleFormModalToggle();
  };

  const handleTableModalToggle = (): void => {
    setIsTableModalOpen(!isTableModalOpen);
  };

  const tempRows: any = [];

  const handleDeleteAction = (event: any): void => {
    const serviceName: string = event.target.parentNode.parentNode.firstChild.innerText;
    const tempData: ServiceMeta = { ...data };
    tempData?.services.splice(
      tempData?.services.findIndex((element: ServiceDefinition) => element.name === serviceName),
      1
    );
    localStorage.setItem("services", JSON.stringify(tempData));
    setData(tempData);
  };

  const getValues = (service: ServiceDefinition) => {
    const tempCells = [];
    for (const item in service) {
      if (item === "name") {
        const ele = {
          title: service.name,
        };
        tempCells.push(ele);
      } else if (item === "url") {
        const ele = {
          title: service.url,
        };
        tempCells.push(ele);
      } else if (item === "type") {
        const ele = {
          title: service.type,
        };
        tempCells.push(ele);
      } else {
        const ele = {
          title: (
            <Button variant="primary" onClick={() => handleDeleteAction(service)}>
              Delete
            </Button>
          ),
        };
        tempCells.push(ele);
      }
    }
    tempCells.push({
      title: (
        <Button variant="primary" onClick={(service) => handleDeleteAction(service)}>
          Delete
        </Button>
      ),
    });
    return { tempCells };
  };

  const tableContent = (data: ServiceMeta): void => {
    if (data && data.services) {
      data.services.map((service: ServiceDefinition) => {
        const retrievedValue: any = getValues(service);
        tempRows.push({
          cells: retrievedValue.tempCells,
        });
      });
    }
    if (tempRows.length === 0) {
      const emptyStateRow = [
        {
          rowKey: "1",
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={CubesIcon} />
                  <Title headingLevel="h4" size="lg">
                    No service found
                  </Title>
                  <EmptyStateBody>Add new service by clicking the "New service" button.</EmptyStateBody>
                </EmptyState>
              ),
            },
          ],
        },
      ];
      setRows(emptyStateRow);
    } else {
      setRows(tempRows);
    }
  };

  React.useEffect(() => {
    setData(JSON.parse(localStorage.getItem("services") || "[]"));
  }, [isTableModalOpen]);

  React.useEffect(() => {
    tableContent(data);
  }, [data]);

  return (
    <>
      <Button variant="secondary" onClick={handleTableModalToggle} ouiaId="catalog-button">
        Catalog
      </Button>
      <Modal
        variant={ModalVariant.medium}
        title="Service catalog"
        isOpen={isTableModalOpen}
        onClose={handleTableModalToggle}
      >
        <Button variant="primary" onClick={switchModal} style={{ float: "right" }} ouiaId="catalog-button">
          New service
        </Button>
        <Table
          gridBreakPoint="grid-xl"
          aria-label="This is a table with checkboxes"
          // onSelect={this.onSelect}
          cells={columns}
          rows={rows}
          // actions={this.actions}
          // canSelectAll={canSelectAll}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Modal>
    </>
  );
};

export default CatalogTable;
