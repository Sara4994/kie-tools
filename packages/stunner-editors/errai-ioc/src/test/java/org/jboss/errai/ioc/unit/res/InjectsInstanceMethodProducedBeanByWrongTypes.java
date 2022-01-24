/*
 * Copyright (C) 2017 Red Hat, Inc. and/or its affiliates.
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

package org.jboss.errai.ioc.unit.res;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.jboss.errai.ioc.tests.wiring.client.res.QualForProducedTypeBean;
import org.jboss.errai.ioc.tests.wiring.client.res.QualForProducedTypeBean.ProducerType;
import org.jboss.errai.ioc.tests.wiring.client.res.TypedBaseType;
import org.jboss.errai.ioc.tests.wiring.client.res.TypedSuperInterface;
import org.jboss.errai.ioc.tests.wiring.client.res.TypedTargetInterface;
import org.jboss.errai.ioc.tests.wiring.client.res.TypedType;

/**
 *
 * @author Max Barkley <mbarkley@redhat.com>
 */
@Dependent
public class InjectsInstanceMethodProducedBeanByWrongTypes {

  @Inject @QualForProducedTypeBean(isStatic=false, type=ProducerType.METHOD) TypedSuperInterface badSuperIface;
  @Inject @QualForProducedTypeBean(isStatic=false, type=ProducerType.METHOD) TypedTargetInterface goodIface;
  @Inject @QualForProducedTypeBean(isStatic=false, type=ProducerType.METHOD) TypedBaseType badSuperType;
  @Inject @QualForProducedTypeBean(isStatic=false, type=ProducerType.METHOD) TypedType goodExactType;

}
