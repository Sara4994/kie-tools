/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
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

import * as jsonc from "jsonc-parser";

// types SwfJSONPath, SwfLSNode, SwfLSNodeType need to be compatible with jsonc types
export declare type SwfJsonPath = (string | number)[];
export declare type SwfLsNodeType = "object" | "array" | "property" | "string" | "number" | "boolean" | "null";

export type SwfLsNode = {
  type: SwfLsNodeType;
  value?: any;
  offset: number;
  length: number;
  colonOffset?: number;
  parent?: SwfLsNode;
  children?: SwfLsNode[];
};

/**
 * Check if a Node is in Location.
 *
 * @param root root node
 * @param node the Node to check
 * @param path the location to verify
 * @returns true if the node is in the location, false otherwise
 */
export function matchNodeWithLocation(
  root: SwfLsNode | undefined,
  node: SwfLsNode | undefined,
  path: SwfJsonPath
): boolean {
  if (!root || !node || !path || !path.length) {
    return false;
  }

  const nodesAtLocation = findNodesAtLocation(root, path);

  if (nodesAtLocation.some((currentNode) => currentNode === node)) {
    return true;
  } else if (path[path.length - 1] === "*" && !nodesAtLocation.length) {
    return matchNodeWithLocation(root, node, path.slice(0, -1));
  }

  return false;
}

// This is very similar to `jsonc.findNodeAtLocation`, but it allows the use of '*' as a wildcard selector.
// This means that unlike `jsonc.findNodeAtLocation`, this method always returns a list of nodes, which can be empty if no matches are found.
export function findNodesAtLocation(root: jsonc.Node | undefined, path: any): jsonc.Node[] {
  if (!root) {
    return [];
  }

  let nodes: jsonc.Node[] = [root];

  for (const segment of path) {
    if (segment === "*") {
      nodes = nodes.flatMap((s) => s.children ?? []);
      continue;
    }

    if (typeof segment === "number") {
      const index = segment as number;
      nodes = nodes.flatMap((n) => {
        if (n.type !== "array" || index < 0 || !Array.isArray(n.children) || index >= n.children.length) {
          return [];
        }

        return [n.children[index]];
      });
    }

    if (typeof segment === "string") {
      nodes = nodes.flatMap((n) => {
        if (n.type !== "object" || !Array.isArray(n.children)) {
          return [];
        }

        for (const prop of n.children) {
          if (Array.isArray(prop.children) && prop.children[0].value === segment && prop.children.length === 2) {
            return [prop.children[1]];
          }
        }

        return [];
      });
    }
  }

  return nodes;
}
