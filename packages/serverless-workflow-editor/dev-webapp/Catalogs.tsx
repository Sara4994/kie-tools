import React, { useState } from "react";
import { Modal, ModalVariant } from "@patternfly/react-core/dist/js/components/Modal";
import { Button } from "@patternfly/react-core/dist/js/components/Button";
import { Form, FormGroup } from "@patternfly/react-core/dist/js/components/Form";
import { TextInput } from "@patternfly/react-core/dist/js/components/TextInput";
import { Card, CardBody } from "@patternfly/react-core/dist/js/components/Card";
import { Gallery, GalleryItem } from "@patternfly/react-core/dist/js/layouts/Gallery";
import { Table, TableHeader, TableBody } from "@patternfly/react-table/dist/js/components/Table";
import { Toolbar } from "@patternfly/react-core/dist/js/components/Toolbar";
import { Title } from "@patternfly/react-core/dist/js/components/Title";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
} from "@patternfly/react-core/dist/js/components/EmptyState";
import { CubesIcon, ExclamationCircleIcon } from "@patternfly/react-icons";

interface serviceMeta {
  name: string;
  url: string;
  type: string;
}

const Catalogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatalogForm, setIsCatalogForm] = useState(false);
  const [selected, setSelected] = useState<any>("");
  const [serviceName, setServiceName] = useState("");
  const [serviceurl, setServiceUrl] = useState("");
  const [data, setData] = useState<any>([]);
  const columns = ["Name", "Url", "Type", ""];
  const tempRows: any = [];
  const [rows, setRows] = useState<any>([]);
  const [validateName, setValidateName] = useState<any>("default");
  const [validateUrl, setValidateUrl] = useState<any>("default");
  const nameInvalidText = "Enter a valid name";
  const urlInvalidText = "Enter a valid url";
  const helperText = "enter text";

  const handleDeleteAction = (service: any): void => {
    console.log("data", data);
    // data?.services.filter((element: any) => {
    //   return element.name !== service.name
    // })
    const tempData: any = { ...data };
    tempData?.services.splice(
      tempData?.services.findIndex((element: any) => element.name === service.name),
      1
    );
    tableContent(tempData);
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
            <Button variant="primary" onClick={(service) => handleDeleteAction(service)}>
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
    const data = JSON.parse(localStorage.getItem("services") || "[]");
    // setRows([])
    setData(data);
    tableContent(data);
  }, [isModalOpen]);

  const handleModalToggle = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const switchModal = (): void => {
    setIsModalOpen(false);
    resetForm();
    handleFormModalToggle();
  };

  const handleFormModalToggle = (): void => {
    setIsCatalogForm(!isCatalogForm);
  };

  const onClick = (event: React.MouseEvent): void => {
    const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
    setSelected(newSelected);
  };

  const handleNameChange = (value: string): void => {
    setServiceName(value);
  };

  const handleUrlChange = (value: string): void => {
    setServiceUrl(value);
  };

  const resetForm = (): void => {
    setSelected("");
    setServiceName("");
    setServiceUrl("");
  };

  const handleCreateService = (): void => {
    if (serviceName.length === 0 || typeof serviceName === "number") {
      setValidateName("error");
    } else if (serviceurl.length === 0 || typeof serviceurl === "number") {
      setValidateUrl("error");
    } else {
      const tempObj: serviceMeta = {
        name: serviceName,
        url: serviceurl,
        type: selected,
      };
      setValidateName("default");
      setValidateUrl("default");

      if (localStorage.getItem("services") === null) {
        const catalog: any = {};
        let serivces = [];
        serivces.push(tempObj);
        catalog.services = serivces;
        localStorage.setItem("services", JSON.stringify(catalog));
      } else {
        const temp = JSON.parse(localStorage.getItem("services") || "{}");
        temp.services.push(tempObj);
        localStorage.setItem("services", JSON.stringify(temp));
      }
      handleFormModalToggle();
    }
  };

  const toolbarItems = () => {
    return (
      <Button variant="primary" onClick={switchModal} ouiaId="catalog-button">
        New service
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Button variant="secondary" onClick={handleModalToggle} ouiaId="catalog-button">
        Catalog
      </Button>
      <Modal variant={ModalVariant.medium} title="Service catalog" isOpen={isModalOpen} onClose={handleModalToggle}>
        <Button variant="primary" onClick={switchModal} style={{ float: "right" }} ouiaId="catalog-button">
          New service
        </Button>
        <Table
          gridBreakPoint="grid-xl"
          header={
            <React.Fragment>
              <Toolbar id="page-layout-table-column-management-action-toolbar-top">{toolbarItems}</Toolbar>
            </React.Fragment>
          }
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
      <Modal
        variant={ModalVariant.medium}
        title="New service"
        isOpen={isCatalogForm}
        onClose={handleFormModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleCreateService}>
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={handleFormModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        <Form>
          <FormGroup label="Service type" fieldId="simple-form-email-01" />
          <Gallery hasGutter style={{ margin: "0px 25px 25px 25px" }}>
            <GalleryItem key={0}>
              <Card id="OpenApi" isSelectable isSelected={selected === "OpenApi"} onClick={onClick}>
                <CardBody>OpenApi</CardBody>
              </Card>
            </GalleryItem>
            <GalleryItem key={1}>
              <Card id="Graphql" isSelectable isSelected={selected === "Graphql"} onClick={onClick}>
                <CardBody>Graphql</CardBody>
              </Card>
            </GalleryItem>
          </Gallery>
          <FormGroup label="Name" isRequired fieldId="service-name" helperTextInvalidIcon={<ExclamationCircleIcon />}>
            <TextInput
              isRequired
              type="text"
              id="service-name"
              name="service-name"
              value={serviceName}
              onChange={handleNameChange}
              validated={validateName}
            />
          </FormGroup>
          <FormGroup label="URL" isRequired fieldId="service-url" helperTextInvalidIcon={<ExclamationCircleIcon />}>
            <TextInput
              isRequired
              type="text"
              id="service-url"
              name="service-url"
              value={serviceurl}
              onChange={handleUrlChange}
              validated={validateUrl}
            />
          </FormGroup>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Catalogs;
