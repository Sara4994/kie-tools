import * as React from "react";
import { useMemo } from "react";
import { Card, CardTitle, CardFooter, CardBody } from "@patternfly/react-core/dist/js/components/Card";
import { Grid, GridItem } from "@patternfly/react-core/dist/js/layouts/Grid";
import { Button, ButtonVariant } from "@patternfly/react-core/dist/js/components/Button";
import { useRoutes } from "../../navigation/Hooks";
import { Link } from "react-router-dom";
import { Text } from "@patternfly/react-core/dist/js/components/Text";
import { Label, LabelProps } from "@patternfly/react-core/dist/js/components/Label";
import { FolderIcon, FileIcon, MonitoringIcon } from "@patternfly/react-icons/dist/js/icons";
import { labelColors } from "../../workspace/components/FileLabel";

export enum SampleType {
  SW_YML = "sw.yml",
  SW_YAML = "sw.yaml",
  SW_JSON = "sw.json",
  SW_PROJECT = "sw.project",
  DASH_YML = "dash.yml",
  DASH_YAML = "dash.yaml",
}

export type Sample = {
  name: string;
  fileName: string;
  svg: string;
  description: string;
  type: SampleType;
};

const tagMap: Record<SampleType, { label: string; icon: React.ComponentClass; color: LabelProps["color"] }> = {
  [SampleType.SW_YML]: {
    label: labelColors[SampleType.SW_YML].label,
    icon: FileIcon,
    color: labelColors[SampleType.SW_YML].color,
  },
  [SampleType.SW_YAML]: {
    label: labelColors[SampleType.SW_YAML].label,
    icon: FileIcon,
    color: labelColors[SampleType.SW_YAML].color,
  },
  [SampleType.SW_JSON]: {
    label: labelColors[SampleType.SW_JSON].label,
    icon: FileIcon,
    color: labelColors[SampleType.SW_JSON].color,
  },
  [SampleType.SW_PROJECT]: {
    label: "Serverless Project",
    icon: FolderIcon,
    color: "orange",
  },
  [SampleType.DASH_YML]: {
    label: labelColors[SampleType.DASH_YML].label,
    icon: MonitoringIcon,
    color: labelColors[SampleType.DASH_YML].color,
  },
  [SampleType.DASH_YAML]: {
    label: labelColors[SampleType.DASH_YAML].label,
    icon: MonitoringIcon,
    color: labelColors[SampleType.DASH_YAML].color,
  },
};
const useSvg = (svg: string) => {
  const svgWrapperRef = React.useRef<any>(null);
  React.useEffect(() => {
    svgWrapperRef.current.innerHTML = svg;
  }, []);
  return {
    svgWrapperRef,
  };
};

export function RenderSvg(props: { svg: string }) {
  const { svgWrapperRef } = useSvg(props.svg);
  return (
    <div ref={svgWrapperRef} style={{ height: "100%", maxWidth: "100%", maxHeight: "400px", paddingTop: "30px" }}></div>
  );
}

export function SampleCard(props: { sample: Sample }) {
  const routes = useRoutes();

  const tag = useMemo(() => tagMap[props.sample.type], [props.sample.type]);

  return (
    <Card isCompact={true} isFullHeight={true}>
      <Grid style={{ height: "100%" }}>
        <GridItem
          md={6}
          style={{ overflow: "hidden", textAlign: "center", verticalAlign: "middle", position: "relative" }}
        >
          <div style={{ position: "absolute", bottom: "16px", right: 0, left: 0, margin: "auto" }}>
            <Label color={tag.color}>
              <tag.icon />
              &nbsp;&nbsp;<b>{tag.label}</b>
            </Label>
          </div>
          <RenderSvg svg={props.sample.svg} />
        </GridItem>
        <GridItem md={6} style={{ display: "flex", flexDirection: "column" }}>
          <CardTitle data-ouia-component-type="sample-title">{props.sample.name}</CardTitle>
          <CardBody isFilled={true}>
            <Text component="p">{props.sample.description}</Text>
          </CardBody>
          <CardFooter style={{ alignItems: "baseline" }}>
            <Link
              to={{
                pathname: routes.sampleShowcase.path({}),
                search: routes.sampleShowcase.queryString({ sampleId: props.sample.fileName }),
              }}
            >
              <Button variant={ButtonVariant.tertiary} ouiaId={props.sample.fileName + `-try-swf-sample-button`}>
                Try it out!
              </Button>
            </Link>
          </CardFooter>
        </GridItem>
      </Grid>
    </Card>
  );
}
