/** @odoo-module */

import { loadJS } from "@web/core/assets"
const { Component, onWillStart, useRef, onMounted } = owl

export class DateRangePicker extends Component {
    setup(){
        this.dateRangePickerRef = useRef("dateRangePickerRef")
        onWillStart(async ()=>{
            await loadJS( 
                  "https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js",
            )
        })
        onMounted(() => {
            $('#reportrange').daterangepicker({
                ranges: {
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, (start, end) => {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                this.env.bus.trigger('change_period', [start, end]); // Emit the change_period event with the selected range
            });
        });

    }
}
DateRangePicker.template = "my_owl_app.DateRangePickerTemplate"
