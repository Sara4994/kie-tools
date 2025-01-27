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

package org.kie.workbench.common.stunner.sw.definition;

import jsinterop.annotations.JsIgnore;
import jsinterop.annotations.JsType;
import org.jboss.errai.databinding.client.api.Bindable;
import org.kie.workbench.common.stunner.core.definition.annotation.Definition;
import org.kie.workbench.common.stunner.core.definition.annotation.morph.Morph;

/**
 * Operation state defines a set of actions to be performed in sequence or in parallel.
 * Once all actions have been performed, a transition to another state can occur.
 *
 * @see <a href="https://github.com/serverlessworkflow/specification/blob/main/specification.md#Operation-State"> Operation state </a>
 */
@Bindable
@Definition
@Morph(base = State.class)
@JsType
public class OperationState extends State {

    @JsIgnore
    public static final String TYPE_OPERATION = "operation";

    /**
     * Defines if the actions are to be performed sequentially or in parallel.
     * recognized values are `sequential` and `parallel`.
     */
    public String actionMode;

    /**
     * Actions to be performed.
     */
    public ActionNode[] actions;

    /**
     * Whether the state is used to compensate for another state.
     * Defaults to false.
     */
    public boolean usedForCompensation;

    public OperationState() {
        this.type = TYPE_OPERATION;
    }

    public String getActionMode() {
        return actionMode;
    }

    public OperationState setActionMode(String actionMode) {
        this.actionMode = actionMode;
        return this;
    }

    public ActionNode[] getActions() {
        return actions;
    }

    public OperationState setActions(ActionNode[] actions) {
        this.actions = actions;
        return this;
    }

    public boolean isUsedForCompensation() {
        return usedForCompensation;
    }

    public OperationState setUsedForCompensation(boolean usedForCompensation) {
        this.usedForCompensation = usedForCompensation;
        return this;
    }
}
