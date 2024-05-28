/** @odoo-module */

import { registry } from "@web/core/registry"
import { useService } from "@web/core/utils/hooks"
import { loadJS } from "@web/core/assets"
import { MapController } from "./map_controller" 

const MapView = {
    type: "map",
    display_name: "Map",
    icon: "fa fa-map-marker",
    multiRecord: true,
    Controller: MapController,
}


registry.category("views").add("map", MapView)