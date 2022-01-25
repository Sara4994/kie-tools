/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export { SW_SPEC_COMMON_SCHEMA } from "./common";
export { SW_SPEC_EVENTS_SCHEMA } from "./events";
export { SW_SPEC_FUNCTIONS_SCHEMA } from "./functions";
export { SW_SPEC_RETRIES_SCHEMA } from "./retries";
export { SW_SPEC_SCHEMA } from "./workflow";

export const SW_SPEC_SCHEMA_URI =
  "https://raw.githubusercontent.com/serverlessworkflow/specification/0.6.x/schema/workflow.json";