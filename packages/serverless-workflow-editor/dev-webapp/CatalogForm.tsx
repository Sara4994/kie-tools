import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  TextInput,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

interface serviceMeta {
  name: string;
  url: string;
  type: string;
}

enum validate {
  default = "default",
  success = "success",
  warning = "warning",
  error = "error",
}

interface IOwnProps {
  handleFormModalToggle: any;
  isCatalogForm: boolean;
}
const CatalogForm: React.FC<IOwnProps> = ({ isCatalogForm, handleFormModalToggle }) => {
  const [selected, setSelected] = useState<any>("");
  const [serviceName, setServiceName] = useState("");
  const [serviceurl, setServiceUrl] = useState("");
  const [validateName, setValidateName] = useState<validate>(validate.default);
  const [validateUrl, setValidateUrl] = useState<validate>(validate.default);

  const resetForm = (): void => {
    setSelected("");
    setServiceName("");
    setServiceUrl("");
  };

  const handleNameChange = (value: string): void => {
    setServiceName(value);
  };

  const handleUrlChange = (value: string): void => {
    setServiceUrl(value);
  };

  const onClick = (event: React.MouseEvent): void => {
    const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
    setSelected(newSelected);
  };

  const handleCreateService = (): void => {
    if (serviceName.length === 0 || typeof serviceName === "number") {
      setValidateName(validate.error);
    } else if (serviceurl.length === 0 || typeof serviceurl === "number") {
      setValidateUrl(validate.error);
    } else {
      if (selected.length > 0) {
        const tempObj: serviceMeta = {
          name: serviceName,
          url: serviceurl,
          type: selected,
        };
        setValidateName(validate.default);
        setValidateUrl(validate.default);

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
    }
  };

  useEffect(() => {
    isCatalogForm && resetForm();
  }, [isCatalogForm]);

  return (
    <>
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
          <FormGroup label="Service type" fieldId="service-type" helperTextInvalidIcon={<ExclamationCircleIcon />} />
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
    </>
  );
};

export default CatalogForm;
