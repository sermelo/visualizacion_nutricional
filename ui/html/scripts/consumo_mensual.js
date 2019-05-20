var fieldsMap = { "volume": "Volumen (miles de kg)"}
var graphDivId = "#polygon_graph"
var field = ""
var region = ""

var margin = {top: 0, right: 10, bottom: 30, left: 100}
var width = 800 - margin.left - margin.right
var height = 300 - margin.top - margin.bottom
var graphDiv = d3.select(graphDivId)
var container, yAxisContainer, xAxisContainer

var minYScale = 0
var maxYScale = 0
var productsData = new Map()

var productsGraphs = new Map()

/**
 * Change the state and visualization of the product depending of the current state
 *   view: falseo -> true
 *   view: true -> false
 * @param productName The product to query
 * @param dataRegion The region to query
 * @param fieldSortName the desired field to query
 */
function updateGraph(productName, dataRegion, fieldSortName) {
    field = fieldsMap[fieldSortName]
    region = dataRegion
    if (productsGraphs.has(productName) && productsGraphs.get(productName).get("view")) {
        removeProductGraph(productName)
    }
    else {
        addProductGraph(productName, getYear())
    }
}

/**
 * Add a product to the graph. If needed new data will be requested
 * @param productName Name of the product to add
 * @param year year of which the data is wanted
 */ 
function addProductGraph(productName, year) {
    // If not data request it
    if (! productsData.has(year) || ! productsData.get(year).has(productName)) {
        console.log("Adding " + productName + " " + year)
        requestProductData(productName, region, year, field, dataToGraph)
    }
    else { // The data is already downloaded. Show it
        console.log("Activating an already requested product: " + productName)
        productsGraphs.get(productName).set("view", true)
        updateAllProducts()
    }
}

/**
 * Remove a product
 * @param productName Name of the product to remove
 */
function removeProductGraph(productName) {
    console.log("Deactivating a product: " + productName)
    productsGraphs.get(productName).set("view", false)
    updateAllProducts()
}

/**
 * Update all data to new year. The year is extracted from the form
 */
function changeYear() {
    var year = getYear()
    console.log("Change year:" + year)
    productsGraphs.forEach(
        function(product, productName) {
            if (product.get("view")) {
                addProductGraph(productName, year)
            }
        }
    )
}

/**
 * Update all data to new region. The region is extracted from the form
 */
function changeRegion() {
}

/**
 * Create basic structure fot the graph
 */
function createBasicStructure() {
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
 * Take the data and draw a polygon graph of a product if it doesn't exist
 * @param data Json format data to draw
 *     The data should have an "_items" elements with the data
 *     Each element in "_items" should contain at least the
 *     "field"(see fieldsMap variable) and the "mes"(month)
 */
function dataToGraph(data) {
    productName = data._items[0]["Producto"]
    year = data._items[0]["Año"]
    console.log("Received data from " + productName + " " + year)
    if (! productsData.has(year)) {
        productsData.set(year, new Map())
    }
    productsData.get(year).set(productName, data._items)
    if (productsGraphs.has(productName)) {
        productsGraphs.get(productName).set("view", true)
    }
    else {
        productsGraphs.set(productName, new Map([["container", container.append("path")], ["view", true]]))
    }
    updateAllProducts()
}

/**
 * Add a new product path
 * @param productName name of the product to update
 * @param year year of the data to show
 */
function updateProductGraph(productName, year) {
    var productPath = productsGraphs.get(productName).get("container")
    console.log("Analysing product " + productName)
    
    if (! productsGraphs.get(productName).get("view")) { // The poduct view is disable
	console.log("Preparing to hide " + productName)
        productPath.attr("visibility", "hidden")
    }
    else if (! productsData.get(year).has(productName)) { // The product view is enable but there is no data
	console.log("Not available data for " + productName + " and year " + year)
    }
    else { // Starting visualizing the data
        console.log("Preparing to draw " + productName)
        var data = productsData.get(year).get(productName)
        drawGraph(productPath, productsData.get(year).get(productName))
    }
}

/**
 * Draw a path graph
 * @params pathContainer The container in which the graph needs to be drawn
 * @params data Data of the graph
 */
function drawGraph(pathContainer, data) {
    year = data[0]["Año"]
    pathContainer.attr("visibility", "visible")

    var xScale = d3.scaleTime()
        .domain([new Date(year, 0), new Date(year, 11)])
        .range([margin.left, width]);
    xAxisContainer
        .transition()
        .duration(0)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))

    var yScale = getYScale()
    yAxisContainer
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale))

    pathContainer
        .datum(data)
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
 * Upadate all products visualization. Useful to rescale all graphs
 */
function updateAllProducts() {
    productsGraphs.forEach(function(product, productName) {
        updateProductGraph(productName, getYear())
    })
}

/**
 * Return the Y scale based in the current data
 */
function getYScale() {
    var newMaxY = 0
    productsData.get(year).forEach(function(product, productName) {
        var data = product
        if (productsGraphs.get(productName).get("view") && newMaxY < d3.max(data, d => d[field])) {
            newMaxY = d3.max(data, d => d[field])
        }
    })
    var yScale = d3.scaleLinear()
      .domain([0, newMaxY])
      .range([height, 0])
    return yScale
}

/**
 * Return configured year
 */
function getYear() {
    return parseInt(d3.select("#dateList").select('select').property('value'))
}

/**
 * Return configured region
 */
function getRegion() {
    return d3.select("#regionsList").select('select').property('value')
}

createBasicStructure()
