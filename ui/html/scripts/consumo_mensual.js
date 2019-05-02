
var fieldsMap = { "volume": "Volumen (miles de kg)"}
var graphDivId = "#polygon_graph"
var field = ""

/**
 * Construct query Http call
 * @param product The product to query
 * @param region The region to query
 * @param year The year to query
 * @param fieldSortName the desired field to query
 * @return the Http get Url with the query
 */
function printGraph(product, region, year, fieldSortName) {
    field = fieldsMap[fieldSortName]
    requestData(product, region, year, field, dataToGraph)
}

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
    var baseUrl = 'http://localhost:5000/test3'
    var filter = '{"Producto":"' + product + '","Región":"' + region + '","Año":' + year + '}'
    var projection = '{"' + field + '":1,"Mes":1,"Producto":0,"Categoría":0}'
    var dataUrl = encodeURI(baseUrl + '?max_results=300&where=' + filter + '&projection=' + projection);
    return dataUrl
}

/**
 * Take the data and draw a polygon graph in graphDivId div
 * @param data Json format data to draw
 *     The data should have an "_items" elements with the data
 *     Each element in "_items" should contain at least the
 *     "field"(see fieldsMap variable) and the "mes"(month)
 */
function dataToGraph(data) {
    var graphDiv = d3.select(graphDivId)

    // Define the title
    graphDiv.append("div").text(field + " de " + product + " en " + region + " en " + year)

    // Define svg position and size
    var margin = {top: 10, right: 30, bottom: 30, left: 60}
    var width = 600 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom

    // Create svg
    var svg = graphDiv
              .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

    // Get only relevant data
    var monthsData = data._items

    var x = d3.scaleTime()
       .domain([new Date(year, 0), new Date(year, 11)])
       .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(monthsData, d => d[field])])
      .range([height, 0])
    svg.append("g")
      .call(d3.axisLeft(y))

    // Add the line
    svg.append("path")
      .datum(monthsData)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(new Date(year, d.Mes-1)) })
        .y(function(d) { return y(d[field]) })
        )
}
