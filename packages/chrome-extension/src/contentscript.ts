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

import * as ReactDOM from "react-dom";
import { GitHubPageType } from "./github/GitHubPageType";
import { mainContainer, runAfterPagePushState } from "./app/utils";
import { renderSingleEditorApp } from "./app/singleEditor";
import { renderPrEditorsApp } from "./app/prEditors";

const GITHUB_COM = "http[s]://github.com";

function init() {
  console.info(`[Kogito] Starting GitHub extension.`);

  unmountPreviouslyRenderedFeatures();

  const pageType = discoverCurrentGitHubPageType();
  if (pageType === GitHubPageType.ANY) {
    console.info(`[Kogito] Not GitHub edit or view pages.`);
    return;
  }

  if (pageType === GitHubPageType.EDIT || pageType === GitHubPageType.VIEW) {
    renderSingleEditorApp(pageType);
    return;
  }

  if (pageType === GitHubPageType.PR) {
    renderPrEditorsApp();
    return;
  }

  throw new Error(`Unknown GitHubPageType ${pageType}`);
}

runAfterPagePushState(() => setImmediate(init));
setImmediate(() => init());

function uriMatches(regex: string) {
  return !!window.location.href.match(new RegExp(regex));
}

function discoverCurrentGitHubPageType() {
  if (uriMatches(`${GITHUB_COM}/.*/.*/edit/.*`)) {
    return GitHubPageType.EDIT;
  }

  if (uriMatches(`${GITHUB_COM}/.*/.*/blob/.*`)) {
    return GitHubPageType.VIEW;
  }

  if (uriMatches(`${GITHUB_COM}/.*/.*/pull/[0-9]+/files.*`)) {
    return GitHubPageType.PR;
  }

  return GitHubPageType.ANY;
}

function unmountPreviouslyRenderedFeatures() {
  try {
    if (mainContainer()) {
      ReactDOM.unmountComponentAtNode(mainContainer()!);
      console.info("[Kogito] Unmounted features.");
    }
  } catch (e) {
    console.info("[Kogito] Ignoring exception while unmounting features.");
  }
}
