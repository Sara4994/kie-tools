/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./GlobalContext";

export function Toolbar(props: { readonly: boolean }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);

  const goFullScreen = (e: any) => {
    e.preventDefault();
    setGlobalState({ ...globalState, fullscreen: true });
  };

  const seeAsSource = (e: any) => {
    e.preventDefault();
    setGlobalState({ ...globalState, textMode: true });
  };

  const seeAsDiagram = (e: any) => {
    e.preventDefault();
    setGlobalState({ ...globalState, textMode: false });
  };

  useEffect(() => {
    return () => {
      console.info("UNMOUNTED2!");
    };
  }, []);

  return (
    <>
      <div>
        {!globalState.textMode && (
          <button disabled={!globalState.textModeEnabled} className={"btn btn-sm kogito-button"} onClick={seeAsSource}>
            See as source
          </button>
        )}
        {globalState.textMode && (
          <button className={"btn btn-sm kogito-button"} onClick={seeAsDiagram}>
            See as diagram
          </button>
        )}
        {!globalState.textMode && (
          <button className={"btn btn-sm kogito-button"} onClick={goFullScreen}>
            Full screen
          </button>
        )}
      </div>
      {props.readonly &&
        !globalState.textMode && (
          <>
            {/* TODO: Add "info" icon with hint explaining how to edit the file */}
            <h4>🔸️ This is a readonly visualization</h4>
          </>
        )}
    </>
  );
}
