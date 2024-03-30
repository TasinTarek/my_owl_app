/** @odoo-module */

import { loadJS } from "@web/core/assets"
const { Component, onWillStart, useRef, onMounted } = owl

export class Graph extends Component {
    setup(){
        this.chartRef = useRef("chart")
        onWillStart(async ()=>{
            await loadJS(
                  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js", 
            )
        })

        onMounted(()=>this.renderChart())
    }

    renderChart(){
        new Chart(this.chartRef.el,
        {
          type: this.props.type,
          data: {
            labels: [
                'Red',
                'Blue',
                'Yellow'
              ],
              datasets: [
              {
                label: 'My First Dataset',
                data: [300, 50, 100],
                hoverOffset: 4
              },{
                label: 'My Second Dataset',
                data: [100, 70, 150],
                hoverOffset: 4
             }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: this.props.title,
                position: 'bottom',
              }
            }
          },
        }
      );
    }
}
Graph.template = "my_owl_app.Graph"
