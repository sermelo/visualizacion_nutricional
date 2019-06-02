
var baseUrl = 'http://localhost:5000/'

/**
 * Request a product data
 * @param primaryKey The primaryKey value
 * @param secondaryKey1 The secondaryKey1 value
 * @param secondaryKey2 The secondaryKey2 value
 * @param callback method to execute with the data
 */
function requestProductData(primaryKey, secondaryKey1, secondaryKey2, callback) {
    console.log("Requesting: " + primaryKey + " " + secondaryKey1 + " " + secondaryKey2)
    var url = getUrl(primaryKey, secondaryKey1, secondaryKey2, field)
    d3.json(url).then(callback)
}

function getUniqValues(key, callback) {
    if (key == "Año") {
        getUniqYears(callback)
    }
    else if (key == "Región") {
        getUniqRegions(callback)
    }
    else if (key == "Producto") {
        getUniqProducts(callback)
    }
    else {
        getUniqFields(callback)
    }
}

function getUniqYears(callback) {
    var url = baseUrl + "getuniqueyears"
    d3.json(url).then(callback)
}

function getUniqRegions(callback) {
    var url = baseUrl + "getuniqueregions"
    d3.json(url).then(callback)
}

function getUniqProducts(callback) {
    var url = "data/products.json"
    d3.json(url).then(callback)
}

function getUniqFields(callback) {
    var url = "data/fields.json"
    d3.json(url).then(callback)
}

/**
 * Construct query Http call
 * @param primaryKey The primaryKey value
 * @param secondaryKey1 The secondaryKey1 value
 * @param secondaryKey2 The secondaryKey2 value
 * @param field the desired field to query
 * @return the Http get Url with the query
 */
function getUrl(primaryKey, secondaryKey1, secondaryKey2, field) {
    var endpoint = baseUrl + "test3"
    var filter = "{"
    Object.keys(model).forEach(function(key) {
        filter += '"' + model[key] + '":'
        if (key == "primaryKey") {
            value = primaryKey
        }
        else if (key == "secondaryKey1") {
            value = secondaryKey1
        }
        else {
            value = secondaryKey2
        }
        if (model[key] == "Año") {
            filter += value
        }
        else {
            filter += '"' + value + '"'
        }
        filter += ","
    })
    filter = filter.substring(0, filter.length-1);
    filter += "}"
    var projection = '{"Producto":1,"Precio medio kg":1,"Consumo per capita":1,"Gasto per capita":1,"Penetración (%)":1,"Año":1,"Mes":1,"Región":1,"Categoría":0}'
    var sort = '[("Mes",1)]'
    var dataUrl = encodeURI(endpoint + "?max_results=300&where=" + filter + "&projection=" + projection + "&sort=" + sort)
    return dataUrl
}

