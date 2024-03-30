/** @odoo-module */

import { registry } from "@web/core/registry"
import { useService } from "@web/core/utils/hooks"
import { loadJS } from "@web/core/assets"
const { Component, useState, onWillStart } = owl
import { Card } from "../card/card"
import { Graph } from "../graph/graph"
import { DateRangePicker } from "../daterangepicker/daterangepicker"
// import { getColor } from "@web/views/graph/colors"

export class Base extends Component {
        async getTopProducts(){
        let domain = [['state', 'in', ['sale', 'done']]]
        if (this.state.period > 0){
            domain.push(['date','>', this.state.current_date])
        }

        const data = await this.orm.readGroup("sale.report", domain, 
                    ['product_id', 'price_total'], ['product_id'], 
                    { limit: 5, orderby: "price_total desc" })

        this.state.topProducts = {
            data: {
                labels: data.map(d => d.product_id[1]),
                  datasets: [
                  {
                    label: 'Total',
                    data: data.map(d => d.price_total),
                    hoverOffset: 4,
                    // backgroundColor: data.map((_, index) => getColor(index)),
                  },{
                    label: 'Count',
                    data: data.map(d => d.product_id_count),
                    hoverOffset: 4,
                    // backgroundColor: data.map((_, index) => getColor(index)),
                }]
            },
        }
    }

    async getTopSalesPeople(){
        let domain = [['state', 'in', ['sale', 'done']]]
        if (this.state.period > 0){
            domain.push(['date','>', this.state.current_date])
        }
    
        const data = await this.orm.readGroup("sale.report", domain,
            ['user_id', 'price_total'], ['user_id'],
            { limit: 5, orderby: "price_total desc" })
    
        this.state.topSalesPeople = {
            data: {
                labels: data.map(d => d.user_id[1]),
                  datasets: [
                  {
                    label: 'Total',
                    data: data.map(d => d.price_total),
                    hoverOffset: 4,
                    // backgroundColor: data.map((_, index) => getColor(index)),
                  }]
            },
        }
    }

    async getMonthlySales(){
        let domain = [['state', 'in', ['draft','sent','sale', 'done']]]
        if (this.state.period > 0){
            domain.push(['date','>', this.state.current_date])
        }
    
        const data = await this.orm.readGroup("sale.report", domain, ['date', 'state', 'price_total'], ['date', 'state'], { orderby: "date", lazy: false })
    
        const labels = [... new Set(data.map(d => d.date))]
        const quotations = data.filter(d => d.state == 'draft' || d.state == 'sent')
        const orders = data.filter(d => ['sale','done'].includes(d.state))
    
        this.state.monthlySales = {
            data: {
                labels: labels,
                  datasets: [
                  {
                    label: 'Quotations',
                    data: labels.map(l=>quotations.filter(q=>l==q.date).map(j=>j.price_total).reduce((a,c)=>a+c,0)),
                    hoverOffset: 4,
                    backgroundColor: "red",
                  },{
                    label: 'Orders',
                    data: labels.map(l=>orders.filter(q=>l==q.date).map(j=>j.price_total).reduce((a,c)=>a+c,0)),
                    hoverOffset: 4,
                    backgroundColor: "green",
                }]
            },
        }
    }

    async getPartnerOrders(){
        let domain = [['state', 'in', ['draft','sent','sale', 'done']]]
        if (this.state.period > 0){
            domain.push(['date','>', this.state.current_date])
        }

        const data = await this.orm.readGroup("sale.report", domain, ['partner_id', 'price_total', 'product_uom_qty'], ['partner_id'], { orderby: "partner_id", lazy: false })

        this.state.partnerOrders = {
            data: {
                labels: data.map(d => d.partner_id[1]),
                  datasets: [
                  {
                    label: 'Total Amount',
                    data: data.map(d => d.price_total),
                    hoverOffset: 4,
                    backgroundColor: "orange",
                    yAxisID: 'Total',
                    order: 1,
                  },{
                    label: 'Ordered Qty',
                    data: data.map(d => d.product_uom_qty),
                    hoverOffset: 4,
                    backgroundColor: "blue",
                    type:"line",
                    borderColor: "blue",
                    yAxisID: 'Qty',
                    order: 0,
                }]
            },
            scales: {
                Qty: {
                    position: 'right',
                }
            },
        }
    }
    setup(){
        
        const notificationService = useService("notification");
        notificationService.add("Welcome !!!");

        this.state = useState({ // Prepare the Component States
            quotations: {
                value: '',
                percentage: '',
            },
            period:7,
        })
        this.orm = useService("orm") // Retrieve and Render Data using ORM Service
        this.actionService = useService("action") // Add Action Service

        onWillStart(async ()=>{
            await loadJS(
                  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js", 
            )
            this.getDates()
            await this.getQuotations()
            await this.getOrders()

            await this.getTopProducts()
            await this.getTopSalesPeople()
            await this.getMonthlySales()
            await this.getPartnerOrders()
        })
        
    }
    async onChangePeriod(ev) {
        const selectedPeriod = ev.target.value; // Get the selected period from the event
        if (selectedPeriod !== "0") {
            this.state.period = parseInt(selectedPeriod); // Update the period in the state
            this.getDates();
            await this.getQuotations();
            await this.getOrders(); 
            await this.getTopProducts(); 
            await this.getTopSalesPeople();
            await this.getMonthlySales(); 
            await this.getPartnerOrders();
        }
    }
    getDates(){
        this.state.current_date = moment().subtract(this.state.period, 'days')
        this.state.previous_date = moment().subtract(this.state.period * 2, 'days')
    }
    
    /**
    * Get the number of quotations and the percentage change between the current and previous date.
    */
    async getQuotations(){
        let domain = [['state', 'in', ['sent', 'draft']]]
        if (this.state.period > 0){
            domain.push(['date_order','>', this.state.current_date])
        }
        const data = await this.orm.search('sale.order', domain)
        const count = data.length; // Get the count of records from the array length
        this.state.quotations.value = count;
    
        // previous period
        let prev_domain = [['state', 'in', ['sent', 'draft']]]
        if (this.state.period > 0){
            prev_domain.push(['date_order','>', this.state.previous_date], ['date_order','<=', this.state.current_date])
        }
        const prev_data = await this.orm.search('sale.order', prev_domain)
        const prev_count = prev_data.length; // Get the count of previous records
        const percentage = ((count - prev_count) / prev_count) * 100;
        this.state.quotations.percentage = percentage.toFixed(2);
    }
    
    /**
    * Get the number of orders, revenues and the average order change between the current and previous date.
    */
    async getOrders(){
        let domain = [["state", "in", ["sale", "done"]]]
        if (this.state.period > 0){
            domain.push(["date_order",">", this.state.current_date])
        }
        const data = await this.orm.search('sale.order', domain)
        const count = data.length; // Get the count of records from the array length
    
        // previous period
        let prev_domain = [["state", "in", ["sale", "done"]]]
        if (this.state.period > 0){
            prev_domain.push(["date_order",">", this.state.previous_date], ["date_order","<=", this.state.current_date])
        }
        const prev_data = await this.orm.search('sale.order', prev_domain)
        const prev_count = prev_data.length; // Get the count of previous records
        const percentage = ((count - prev_count) / prev_count) * 100;
    
        //revenues
        const current_revenue = await this.orm.readGroup("sale.order", domain, ["amount_total:sum"], [])
        const prev_revenue = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:sum"], [])
        const revenue_percentage = ((current_revenue[0].amount_total - prev_revenue[0].amount_total) / prev_revenue[0].amount_total) * 100
    
        //average
        const current_average = await this.orm.readGroup("sale.order", domain, ["amount_total:avg"], [])
        const prev_average = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:avg"], [])
        const average_percentage = ((current_average[0].amount_total - prev_average[0].amount_total) / prev_average[0].amount_total) * 100
    
        this.state.orders = {
            value: count,
            percentage: percentage.toFixed(2),
            revenue: `$${(current_revenue[0].amount_total/1000).toFixed(2)}K`,
            revenue_percentage: revenue_percentage.toFixed(2),
            average: `$${(current_average[0].amount_total/1000).toFixed(2)}K`,
            average_percentage: average_percentage.toFixed(2),
        }
    }
}
Base.template = "my_owl_app.TemplateName"
Base.components = { Card, Graph, DateRangePicker }
registry.category("actions").add("my_owl_app.Base", Base)