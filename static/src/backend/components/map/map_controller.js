/** @odoo-module */

const { Component, useState, onWillStart, xml } = owl
// import { standardViewProps } from "@web/views/standardViewProps"
import { MapRenderer } from "./map_renderer"
import { Layout } from "@web/search/layout"

export class MapController extends Component{
    static template = "my_owl_app.MapView"
    static components = { MapRenderer, Layout }
    static props = {
        
    }
    setup(){
        console.log(this);
    }
}