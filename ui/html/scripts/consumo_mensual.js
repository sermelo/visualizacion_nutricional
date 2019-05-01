
var fieldsMap = { "volume": "Volumen (miles de kg)"}

/**
 * Request a product data
 * @param product The product to query
 * @param region The region to query
 * @param year The year to query
 * @param field the desired field to query
 * @param callback method to execute with the data
 */
function requestData(product, region, year, field, callback) {
  var url = getUrl(product, region, year, field)
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
    var baseUrl = 'http://localhost:5000/test2'
    var filter = '{"Producto":"' + product + '","Región":"' + region + '","Año":"' + year + '"}'
    var projection = '{"' + field + '":1,"Mes":1,"Producto":0,"Categoría":0}'
    var dataUrl = encodeURI(baseUrl + '?max_results=300&where=' + filter + '&projection=' + projection);
    return dataUrl
}

var product = "Aceitunas"
var region = "Andalucía"
var year = "2004"
var fieldToQuery = "volume"
var field = fieldsMap[fieldToQuery]
requestData(product, region, year, field, showData)

// Print graphs
function showData(data) {
    // Define the title
    d3.select('body').append('div').text(fieldsMap[field] + " de " + product + " en " + region + " en " + year)
	
    // Get only relevant data
    var monthsData = data._items

    // Define the values domain
    var domain = d3.extent(monthsData, d => d[field])

    // Define font size and color scales
    var fontSizeScale = d3.scaleLinear().domain(domain).range([12, 40])
    var colorScale = d3.scaleLinear().domain(domain).range(["grey", "green"])

    // Print the data
    var elementoUl = d3.select("body").append("ul")
    elementoUl.selectAll("li")
              .data(monthsData)
	      .enter()
	      .append("li")
	      .text(d => d.Mes)
	      .style("font-size", d => fontSizeScale(d[field]))
	      .style("color", d => colorScale(d[field]))
}
