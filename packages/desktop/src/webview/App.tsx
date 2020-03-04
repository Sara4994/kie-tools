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

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HomePage } from "./home/HomePage";
import { EditorPage } from "./editor/EditorPage";
import { GwtEditorRoutes } from "@kogito-tooling/kie-bc-editors";
import { GlobalContext } from "./common/GlobalContext";
import { EnvelopeBusOuterMessageHandlerFactory } from "./editor/EnvelopeBusOuterMessageHandlerFactory";
import "@patternfly/patternfly/patternfly-variables.css";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/patternfly.css";
import "../../static/resources/style.css";
import { File } from "../common/File";
import { DesktopRouter } from "./common/DesktopRouter";
import * as electron from "electron";
import {FileActions} from "./common/FileActions";

interface Props {
  file?: File;
}

enum Pages {
  HOME,
  EDITOR
}

export function App(props: Props) {
  const [page, setPage] = useState(Pages.HOME);
  const [file, setFile] = useState(props.file);

  const envelopeBusOuterMessageHandlerFactory = useMemo(() => new EnvelopeBusOuterMessageHandlerFactory(), []);
  const desktopRouter = useMemo(
    () =>
      new DesktopRouter(
        new GwtEditorRoutes({
          bpmnPath: "editors/bpmn",
          dmnPath: "editors/dmn"
        })
      ),
    []
  );

  const ipc = useMemo(() => electron.ipcRenderer, [electron.ipcRenderer]);

  const fileActions = useMemo(() => new FileActions(ipc), [ipc]);

  const openFile = useCallback(
    (fileToOpen: File) => {
      setFile(fileToOpen);
      setPage(Pages.EDITOR);
    },
    [page, file]
  );

  useEffect(() => {
    ipc.on("openFile", (event: any, data: any) => {
      openFile(data.file);
    });

    return () => {
      ipc.removeAllListeners("openFile");
    };
  }, [ipc, page, file]);

  useEffect(() => {
    ipc.on("goToHomePage", (event: any, data: any) => {
      setPage(Pages.HOME);
      setFile(undefined);
    });

    return () => {
      ipc.removeAllListeners("goToHomePage");
    };
  }, [ipc, page, file]);

  const Router = () => {
    switch (page) {
      case Pages.HOME:
        return <HomePage openFile={openFile} />;
      case Pages.EDITOR:
        return <EditorPage editorType={file!.fileType} />;
      default:
        return <></>;
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        router: desktopRouter,
        envelopeBusOuterMessageHandlerFactory: envelopeBusOuterMessageHandlerFactory,
        iframeTemplateRelativePath: "envelope/index.html",
        fileActions: fileActions,
        file: file
      }}
    >
      <Router />
    </GlobalContext.Provider>
  );
}
