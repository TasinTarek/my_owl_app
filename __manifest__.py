# -*- coding: utf-8 -*-
{
    'name': "My Owl App",

    'summary': "My Owl App",

    'description': """
        App for OWL
    """,

    'author': "Tasin Tarek",
    'website': "https://www.tasintarek-odoo.com",
    'category': 'Tools',
    'version': '17.1',

    # any module necessary for this one to work correctly
    'depends': [
        'base',
        'website',
        'portal',
    ],

    # always loaded
    'data':[
        'views/my_home_dashboard_template.xml',
        'views/ir_actions_client.xml',
        'views/menus.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'my_owl_app/static/src/backend/components/**/*.scss',
            'my_owl_app/static/src/backend/components/**/*.xml',
            'my_owl_app/static/src/backend/components/**/*.js',
        ],
        'my_owl_app.assets': [
             # bootstrap
            ('include', 'web._assets_helpers'),
            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            ('include', 'web._assets_bootstrap_backend'),

            # required for fa icons
            'web/static/src/libs/fontawesome/css/font-awesome.css',
            
            # include base files from framework
            ('include', 'web._assets_core'),

            # remove some files that we do not use to create a minimal bundle
            ('remove', 'web/static/src/core/**/*'),
            ('remove', 'web/static/lib/luxon/luxon.js'),
            'web/static/src/core/utils/concurrency.js',
            'web/static/src/core/utils/strings.js',
            'web/static/src/core/l10n/translation.js',
            'web/static/src/core/utils/functions.js',
            'web/static/src/core/browser/browser.js',
            'web/static/src/core/registry.js',
            'web/static/src/core/assets.js',
            'my_owl_app/static/src/frontend/**/*',
        ],
    },
    'demo': [],
    'icon': '/my_owl_app/static/description/icon.png',
    'images': [],
    'installable': True,
    'auto_install': False,
    'application': True,
    'price': 0,
    'currency': 'EUR',
    'license': 'OPL-1',
    'contributors': [
        'Tasin Tarek <https://github.com/TasinTarek>',
    ],
}

