MODULES_FOLDER = modules
COMPONENTS_FOLDER = components

.PHONY: module
module:
	ng generate module $(MODULES_FOLDER)/$(MODULE_NAME) --routing

.PHONY: component
component:
	ng generate component $(MODULES_FOLDER)/$(MODULE_NAME)/$(COMPONENTS_FOLDER)/$(COMPONENT_NAME) --styleext less -p ccex
