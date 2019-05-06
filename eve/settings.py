
X_DOMAINS = "*"
RESOURCE_METHODS = ['GET']
ITEM_METHODS = ['GET']
PAGINATION_LIMIT = 500

EXTRA_RESPONSE_FIELDS = []

MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'tfm'

DOMAIN = {
    'test1': {
        'schema': {
            'Producto': {
                'type': 'string'
            },
            'Categoría': {
                'type': 'string'
            }
        }
    },
    'test2': {
        'schema': {
            'Producto': {
                'type': 'string'
            },
            'Categoría': {
                'type': 'string'
            },
            "Volumen (miles de kg)" : {
                "type": "float"
            },
            "Mes" : {
                "type": "string"
            },
            "Año": {
                "type": "string"
            },
        }
    },
    'test3': {
        'schema': {
            'Producto': {
                'type': 'string'
            },
            'Categoría': {
                'type': 'string'
            },
            "Volumen (miles de kg)" : {
                "type": "float"
            },
            "Mes" : {
                "type": "int"
            },
            "Año": {
                "type": "int"
            },
        }
    },
    "getuniqueyears" :{
        'datasource': {
            'source': 'test3',
            'aggregation' : {
                'pipeline': [
                    {"$group" : {"_id":"$Año", "count" : {"$sum" : 1}}}
                ]
            }
        }
    }
}
