/* @odoo-module */

const { Component, whenReady, App, onWillStart } = owl
import { templates } from "@web/core/assets"
import { loadJS } from "@web/core/assets"
import { Graph } from "./graphs/graphs"

class Base extends Component {
    static template = "my_owl_app.MyDashboard"
    static components = { Graph };
    setup(){
            onWillStart(async ()=>{
                await loadJS(
                "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.20.0/js/mdb.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.20.0/css/mdb.min.css",
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
