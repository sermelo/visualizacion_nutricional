
var baseUrl = 'http://localhost:5000/'

/**
 * Request a product data
 * @param product The product to query
 * @param region The region to query
 * @param year The year to query
 * @param field the desired field to query
 * @param callback method to execute with the data
 */
function requestProductData(product, year, region, field, callback) {
    var url = getUrl(product, year, region, field)
    d3.json(url).then(callback)
}

function getUniqYears(callback) {
//    var url = baseUrl + "getuniqueyears"
    var url = "data/years.json"
    d3.json(url).then(callback)
}

function getUniqRegions(callback) {
//    var url = baseUrl + "getuniqueregions"
    var url = "data/regions.json"
    d3.json(url).then(callback)
}

function getUniqProducts(callback) {
//    var url = baseUrl + "getuniqueproducts"
    var url = "data/products.json"
    d3.json(url).then(callback)
}

/**
 * Construct query Http call
 * @param product The product to query
 * @param region The region to query
 * @param year The year to query
 * @param field the desired field to query
 * @return the Http get Url with the query
 */
function getUrl(primaryKey, secondaryKey1, secondaryKey2, field) {
/*    var endpoint = baseUrl + "test3"
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
    var projection = '{"Producto":1,"' + field + '":1,"Año":1,"Mes":1,"Región":1,"Categoría":0}'
    var dataUrl = encodeURI(endpoint + '?max_results=300&where=' + filter + '&projection=' + projection);
   */
    var product
    var region
    var year
    Object.keys(model).forEach(function(key) {
        if (key == "primaryKey") {
                value = primaryKey
        }
            else if (key == "secondaryKey1") {
                value = secondaryKey1
        }
            else {
                value = secondaryKey2
        }
        if (model[key] == "Producto") {
            product = value
        }
        else if (model[key] == "Región") {
            region = value
        }
        else {
            year = value
        }
    })
    return "data/" + product + "_" + year + "_" + region + ".json"
}

