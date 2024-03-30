/* @odoo-module */

const { Component, whenReady, App, onWillStart } = owl
import { templates } from "@web/core/assets"
import { loadJS } from "@web/core/assets"
import { Graph } from "./graphs/graphs"
import { Table } from "./tables/table"

class Base extends Component {
    static template = "my_owl_app.MyDashboard"
    static components = { Graph, Table };
    setup(){
            onWillStart(async ()=>{
                await loadJS(
                    "https://code.jquery.com/jquery-3.7.1.js",
                )
            })
        }
}

whenReady(()=>{
    const my_dashboard = new App(Base, { templates })

    const owl_app_selector = document.querySelector('#owl_wrapwrap')
    if (owl_app_selector){
        my_dashboard.mount(owl_app_selector)
    }
})
