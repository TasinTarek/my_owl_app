# -*- coding: utf-8 -*-
from odoo import api, fields, models, tools, _
from odoo.exceptions import ValidationError, UserError
from odoo import http
from odoo.http import request
from datetime import datetime
from random import randint
import calendar, math, re, io, base64, os, json

import logging
_logger = logging.getLogger(__name__)

class View(models.Model):
    _inherit = "ir.actions.act_window.view"

    view_mode = fields.Selection(selection_add=[("map", "Map")], ondelete={"map": "cascade"})