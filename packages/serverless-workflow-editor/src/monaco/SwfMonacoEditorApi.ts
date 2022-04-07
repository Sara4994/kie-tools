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

import { editor, KeyCode, KeyMod } from "monaco-editor";
import { SwfMonacoEditorCommandIds } from "./augmentation/commands";
import { initJsonSchema } from "./augmentation/language/json";
import { initYamlSchema } from "./augmentation/language/yaml";
import { OperatingSystem } from "@kie-tools-core/operating-system";
import { EditorTheme } from "@kie-tools-core/editor/dist/api";
import { debounce } from "underscore";

initJsonSchema();
initYamlSchema();

export interface SwfMonacoEditorApi {
  show: (container: HTMLDivElement, theme?: EditorTheme) => editor.IStandaloneCodeEditor;
  undo: () => void;
  redo: () => void;
  getContent: () => string;
  setTheme: (theme: EditorTheme) => void;
  getValidationMarkers: () => void;
}

export enum MonacoEditorOperation {
  UNDO,
  REDO,
  EDIT,
}

export interface SwfMonacoEditorInstance {
  commands: SwfMonacoEditorCommandIds;
  instance: editor.IStandaloneCodeEditor;
}

export class DefaultSwfMonacoEditorController implements SwfMonacoEditorApi {
  private readonly model: editor.ITextModel;

  public editor: editor.IStandaloneCodeEditor;

  constructor(
    content: string,
    private readonly onContentChange: (content: string, operation: MonacoEditorOperation) => void,
    private readonly language: string,
    private readonly operatingSystem: OperatingSystem | undefined,
    private readonly setErrors: (errors: any) => void
  ) {
    console.log("Default", content);
    this.model = editor.createModel(content, this.language);
    this.model.onDidChangeContent((event) => {
      if (!event.isUndoing && !event.isRedoing) {
        this.editor?.pushUndoStop();
        onContentChange(this.model.getValue(), MonacoEditorOperation.EDIT);
        console.log("myCheck", editor.getModelMarkers({}), this.model.getValue());
      }
    });
    editor.onDidChangeMarkers(() => {
      this.setErrors(this.getValidationMarkers());
    });
  }

  public redo(): void {
    this.editor?.focus();
    this.editor?.trigger("editor", "redo", null);
  }

  public undo(): void {
    this.editor?.focus();
    this.editor?.trigger("editor", "undo", null);
  }

  public setTheme(theme: EditorTheme): void {
    editor.setTheme(this.getMonacoThemeByEditorTheme(theme));
  }

  public getValidationMarkers = (): editor.IMarker[] => {
    return editor.getModelMarkers({});
  };

  public debounce = (cb: any, delay: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  public show(container: HTMLDivElement, theme: EditorTheme): editor.IStandaloneCodeEditor {
    if (!container) {
      throw new Error("We need a container to show the editor!");
    }

    if (this.editor !== undefined) {
      this.setTheme(theme);
      return this.editor;
    }

    this.editor = editor.create(container, {
      model: this.model,
      language: this.language,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      fontSize: 14,
      theme: this.getMonacoThemeByEditorTheme(theme),
    });

    this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_Z, () => {
      this.onContentChange(this.model.getValue(), MonacoEditorOperation.UNDO);
    });

    this.editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KEY_Z, () => {
      this.onContentChange(this.model.getValue(), MonacoEditorOperation.REDO);
    });

    if (this.operatingSystem !== OperatingSystem.MACOS) {
      this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_Y, () => {
        this.onContentChange(this.model.getValue(), MonacoEditorOperation.REDO);
      });
    }
    // this.setErrors(this.getValidationMarkers());

    return this.editor;
  }

  public getContent(): string {
    return this.editor.getModel()?.getValue() || "";
  }

  private getMonacoThemeByEditorTheme(theme?: EditorTheme): string {
    switch (theme) {
      case EditorTheme.DARK:
        return "vs-dark";
      case EditorTheme.HIGH_CONTRAST:
        return "hc-black";
      default:
        return "vs";
    }
  }
}
