/*
 * Copyright 2014 JBoss Inc
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
package org.kie.workbench.common.services.backend.builder;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Specializes;
import javax.inject.Inject;

import org.kie.workbench.common.services.shared.kmodule.KModuleService;
import org.uberfire.backend.vfs.Path;

/**
 * Listener for changes to project resources to handle incremental builds
 */
@ApplicationScoped
@Specializes
public class ResourceChangeIncrementalBuilder
        extends org.guvnor.common.services.builder.ResourceChangeIncrementalBuilder {

    @Inject
    private KModuleService kModuleService;

    @Override
    protected boolean isProjectResourceUpdateNeeded( Path resource ) {
        return projectService.isPom( resource ) || kModuleService.isKModule( resource );
    }
}
