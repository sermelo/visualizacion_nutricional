
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
            'Región': {
                'type': 'string'
            },
            'Categoría': {
                'type': 'string'
            },
            "Precio medio kg" : {
                "type": "float"
            },
            "Consumo per capita" : {
                "type": "float"
            },
            "Gasto per capita" : {
                "type": "float"
            },
            "Penetración (%)" : {
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
                    {"$group" : {"_id":"$Año", "count" : {"$sum" : 1}}},
                    {"$sort": {"_id":1}}
                ]
            }
        }
    },
    "getuniqueregions" :{
        'datasource': {
            'source': 'test3',
            'aggregation' : {
                'pipeline': [
                    {"$group" : {"_id":"$Región", "count" : {"$sum" : 1}}},
                    {"$sort": {"_id":1}}
                ]
            }
        }
    },
    "getuniqueproducts" :{
        'datasource': {
            'source': 'test3',
            'aggregation' : {
                'pipeline': [
                    {"$group" : {"_id":"$Producto", "count" : {"$sum" : 1}}},
                    {"$sort": {"_id":1}}
                ]
            }
        }
    },
}
