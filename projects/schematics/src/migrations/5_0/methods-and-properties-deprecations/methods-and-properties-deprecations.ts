import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { MethodPropertyDeprecation } from '../../../shared/utils/file-utils';
import { migrateMethodPropertiesDeprecation } from '../../mechanism/methods-and-properties-deprecations/methods-and-properties-deprecations';
import { AUTH_HTTP_HEADER_SERVICE_MIGRATION } from './data/auth-http-header.service.migration';
import { CONFIGURATOR_ATTRIBUTE_MULTI_SELECTION_BUNDLE_COMPONENT_MIGRATION } from './data/configurator-attribute-multi-selection-bundle.component.migration';
import { CONFIGURATOR_ATTRIBUTE_SINGLE_SELECTION_BUNDLE_COMPONENT_MIGRATION } from './data/configurator-attribute-single-selection-bundle.component.migration';
import { CONFIGURATOR_COMMONS_SERVICE_MIGRATION } from './data/configurator-commons-service.migration';
import { QUICK_ORDER_SERVICE_MIGRATION } from './data/quick-order.service.migration';
import { NAVIGATION_UI_COMPONENT_MIGRATION } from './data/navigation-ui.component.migration';

export const METHODS_AND_PROPERTIES_DEPRECATIONS_DATA: MethodPropertyDeprecation[] =
  [
    ...AUTH_HTTP_HEADER_SERVICE_MIGRATION,
    ...QUICK_ORDER_SERVICE_MIGRATION,
    ...CONFIGURATOR_ATTRIBUTE_MULTI_SELECTION_BUNDLE_COMPONENT_MIGRATION,
    ...CONFIGURATOR_ATTRIBUTE_SINGLE_SELECTION_BUNDLE_COMPONENT_MIGRATION,
    ...CONFIGURATOR_COMMONS_SERVICE_MIGRATION,
    ...NAVIGATION_UI_COMPONENT_MIGRATION,
  ];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateMethodPropertiesDeprecation(
      tree,
      context,
      METHODS_AND_PROPERTIES_DEPRECATIONS_DATA
    );
  };
}
