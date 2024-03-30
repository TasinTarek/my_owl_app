/** @odoo-module */

const { Component, useRef, onWillStart, onMounted } = owl;
import { loadJS } from "@web/core/assets";

export class Table extends Component {
    setup(){

        this.tableRef = useRef("table1")
        onWillStart(async ()=>{
            await loadJS(
                        "https://cdn.datatables.net/2.0.3/js/dataTables.js",
            );
            await loadJS(
                        "https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.css",
            );
        });
        
        onMounted(()=>this.renderTable())
    }    
    renderTable() {
        new DataTable(this.tableRef.el)
    }
}
Table.template = "my_owl_app.TableTemplate";
