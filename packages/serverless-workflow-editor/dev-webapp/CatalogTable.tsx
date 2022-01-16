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
import { getProcessDefinitionList } from "./apis";

interface serviceMeta {
  name: string;
  url: string;
  type: string;
}

interface IOwnProps {
  handleFormModalToggle: any;
}

const CatalogTable: React.FC<IOwnProps> = ({ handleFormModalToggle }) => {
  const defaultData = JSON.parse(localStorage.getItem("services") || "[]");
  const [data, setData] = useState<any>(defaultData);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const columns = ["Name", "Url", "Type", ""];
  const [rows, setRows] = useState<any>([]);

  const switchModal = (): void => {
    setIsTableModalOpen(false);
    handleFormModalToggle();
  };

  const handleTableModalToggle = (): void => {
    setIsTableModalOpen(!isTableModalOpen);
  };
  console.log("tableModal", isTableModalOpen);
  const tempRows: any = [];

  const handleDeleteAction = (service: any): void => {
    const serviceName: string = service.target.parentNode.parentNode.firstChild.innerText;
    const tempData: any = { ...data };
    tempData?.services.splice(
      tempData?.services.findIndex((element: any) => element.name === serviceName),
      1
    );
    localStorage.setItem("services", JSON.stringify(tempData));
    console.log("tempData", tempData);
    setData(tempData);
  };

  const getValues = (service: serviceMeta) => {
    const tempCells = [];
    for (const item in service) {
      console.log("item", item);
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

  const tableContent = (data: any) => {
    console.log("here tableContent");
    if (data && data.services) {
      data.services.map((service: serviceMeta) => {
        const retrievedValue: any = getValues(service);
        tempRows.push({
          cells: retrievedValue.tempCells,
        });
      });
    }
    console.log("tempRows", tempRows);
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
      console.log("here");
      setRows(emptyStateRow);
    } else {
      setRows(tempRows);
    }
  };
  console.log("rows", rows);

  React.useEffect(() => {
    // setRows([])
    getProcessDefinitionList();
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
