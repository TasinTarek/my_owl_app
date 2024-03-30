# -*- coding: utf-8 -*-
from odoo import http


class KolpolokDashboard(http.Controller):
    @http.route('/my/home/dashboard', auth='public')
    def my_home_dashboard(self, **kw):
        return http.request.render("my_owl_app.my_home_dashboard")