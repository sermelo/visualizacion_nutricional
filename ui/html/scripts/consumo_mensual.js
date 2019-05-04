var fieldsMap = { "volume": "Volumen (miles de kg)"}
var graphDivId = "#polygon_graph"
var field = ""
var product = ""
var region = ""
var year = ""

var margin = {top: 0, right: 10, bottom: 30, left: 100}
var width = 800 - margin.left - margin.right
var height = 300 - margin.top - margin.bottom
var graphDiv = d3.select(graphDivId)
var container, yAxisContainer, xAxisContainer

var minYScale = 0
var maxYScale = 0
var paths = new Map();

/**
 * Construct query Http call
 * @param dataProduct The product to query
 * @param dataRegion The region to query
 * @param dataYear The year to query
 * @param fieldSortName the desired field to query
 * @return the Http get Url with the query
 */
function printGraph(dataProduct, dataRegion, dataYear, fieldSortName) {
    field = fieldsMap[fieldSortName]
    product = dataProduct
    region = dataRegion
    year = dataYear
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
 * Create empty graph
 */
function createEmptyGraph() {
    container =
        d3.select(graphDivId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
    xAxisContainer = container.append("g")
      .attr("transform", "translate(0," + height + ")")

    yAxisContainer = container
        .append("g")
        .attr("transform", "translate(" + (margin.left) + ", 0)")
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
 * Take the data and draw a polygon graph of a product if it doesn't exist
 * @param data Json format data to draw
 *     The data should have an "_items" elements with the data
 *     Each element in "_items" should contain at least the
 *     "field"(see fieldsMap variable) and the "mes"(month)
 */
function dataToGraph(data) {
    if (! paths.has(product)) {
	newProductValues = new Map([["data", data], ["container", container.append("path")]])
        paths.set(product, newProductValues)
	addProductPath(paths.get(product))
    }
    rescaleProductsPaths()
}

/**
 * Add a new product path
 * @param data data to show
 */
function addProductPath(product) {
    var productPath = product.get("container")
    var data = product.get("data")
    // Get only relevant data
    var monthsData = data._items

    var xScale = d3.scaleTime()
       .domain([new Date(year, 0), new Date(year, 11)])
       .range([margin.left, width]);
    xAxisContainer
       .transition()
       .duration(1000)
       .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))

    if (maxYScale < d3.max(monthsData, d => d[field])) {
        maxYScale = d3.max(monthsData, d => d[field])
    }

    var yScale = d3.scaleLinear()
      .domain([0, maxYScale])
      .range([height, 0])
    yAxisContainer
       .transition()
       .duration(1000)
       .call(d3.axisLeft(yScale))
    productPath
        .datum(monthsData)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(new Date(year, d.Mes-1)) })
            .y(function(d) { return yScale(d[field]) })
            )
}

/**
 * Rescale product to current scale
 */
function rescaleProductsPaths() {
    console.log(paths)
    paths.forEach(updateProductPath)
}

function updateProductPath(product, key, map) {
    addProductPath(product)
}

/**
 * Upgrade the graph
 * @param product The product to query
 * @param toDraw Ignore or draw the product
 * @param region The region to query
 * @param year The year to query
 * @param fieldSortName the desired field to query
 */
function updateGraph(product, toDraw, region, year, fieldSortName) {
    if (toDraw == true) {
        printGraph(product, region, year, fieldSortName)
    }
}

createEmptyGraph()
