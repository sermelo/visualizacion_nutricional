
var baseUrl = 'http://localhost:5000/'

/**
 * Request a product data
 * @param product The product to query
 * @param region The region to query
 * @param year The year to query
 * @param field the desired field to query
 * @param callback method to execute with the data
 */
function requestProductData(product, region, year, field, callback) {
    var url = getUrl(product, region, year, field)
    d3.json(url).then(callback)
}

function getUniqYears(callback) {
    var url = baseUrl + "getuniqueyears"
    d3.json(url).then(callback)
}

function getUniqRegions(callback) {
    var url = baseUrl + "getuniqueregions"
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
function getUrl(product, region, year, field) {
    var endpoint = baseUrl + "test3"
    var filter = '{"Producto":"' + product + '","Región":"' + region + '","Año":' + year + '}'
    var projection = '{"Producto":1,"' + field + '":1,"Mes":1,"Categoría":0}'
    var dataUrl = encodeURI(endpoint + '?max_results=300&where=' + filter + '&projection=' + projection);
    return dataUrl
}

