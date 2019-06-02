var field = "Masa"
var graphDivId = "#polygon_graph"

var margin = {top: 100, right: 300, bottom: 30, left: 100}
var width = 1300 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

var container, yAxisContainer, xAxisContainer

var productsData = new Map()
var productsGraphs = new Map()

/**
 * Create Map with all graph
 * Each element of the map contain an id, a path and a label
 */
function createGraphMap() {
    d3.select("#" + model["primaryKey"]).select("select").selectAll("option").each(
        function(value) {
            console.log(value["_id"])
            productsGraphs.set(value["_id"], new Map([["id", productsGraphs.size], ["path", container.append("path")], ["label", container.append("text")], ["view", false]]))
        }
    )
}

/**
 * Create basic structure fot the graph
 */
function createBasicStructure() {
    var graphDiv = d3.select(graphDivId)
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
 * Change the state and visualization of the product depending of the current state
 *   view: falseo -> true
 *   view: true -> false
 * @param primaryKey main key value
 */
function changePrimaryOption(primaryKey) {
    if (productsGraphs.has(primaryKey) && productsGraphs.get(primaryKey).get("view")) {
        removeGraph(primaryKey)
    }
    else {
        updateGraph(primaryKey)
    }
}

/**
 * Update data to acomodate new secondaryKey
 */
function changeSecondaryOption() {
    productsGraphs.forEach(
        function(graph, primaryKey) {
            if (graph.get("view")) {
                updateGraph(primaryKey)
            }
        }
    )
}

/**
 * Update primaryKey graph. If needed, request new data. All others graph will be scaled if needed
 * @param primarykey value
 */ 
function updateGraph(primaryKey) {
    var secondaryKey1 = getSecondaryKey1()
    var secondaryKey2 = getSecondaryKey2()
    // The data is already downloaded. Show it
    if (isThereData(primaryKey, secondaryKey1, secondaryKey2)) {
        productsGraphs.get(primaryKey).set("view", true)
        updateAllProducts()
    }
    else { // If not data request it
        console.log("Requesting: " + primaryKey + " " + secondaryKey1 + " " + secondaryKey2)
        requestProductData(primaryKey, secondaryKey1, secondaryKey2, field, processData)
    }
}

/**
 * Check if the data has been downloaded previously
 * @param primarykey value
 * @param secondaryKey1 secondary key 1 value
 * @param secondaryKey2 secondary key 2 value
 */ 
function isThereData(primaryKey, secondaryKey1, secondaryKey2) {
    var exist = true
    if (! productsData.has(secondaryKey1) ||
        ! productsData.get(secondaryKey1).has(secondaryKey2) ||
        ! productsData.get(secondaryKey1).get(secondaryKey2).has(primaryKey)) {
        exist = false
    }
    return exist
}

/**
 * Remove a product
 * @param primarykey value
 */
function removeGraph(primaryKey) {
    productsGraphs.get(primaryKey).set("view", false)
    updateAllProducts()
}

/**
 * Take the data and draw a polygon graph of a product if it doesn't exist
 * @param data Json format data to draw
 *     The data should have an "_items" elements with the data
 *     Each element in "_items" should contain at least the
 *     "field"(see fieldsMap variable) and the "mes"(month)
 */
function processData(data) {
    primaryKey = data._items[0][model["primaryKey"]]
    console.log("Received data of " + primaryKey)
    if (! productsGraphs.has(primaryKey)) { // This will be done only first time data is requested
        createGraphMap()
    }
    storeData(data)
    productsGraphs.get(primaryKey).set("view", true)
    updateAllProducts()
}

/**
 * Ensure the product structure exits
 * @param data information to store in productsData
 */
function storeData(data) {
    primaryKey = data._items[0][model["primaryKey"]]
    secondaryKey1 = data._items[0][model["secondaryKey1"]]
    secondaryKey2 = data._items[0][model["secondaryKey2"]]
    if (! productsData.has(secondaryKey1)) {
        productsData.set(secondaryKey1, new Map())
    }
    if (! productsData.get(secondaryKey1).has(secondaryKey2)) {
        productsData.get(secondaryKey1).set(secondaryKey2, new Map())
    }
    productsData.get(secondaryKey1).get(secondaryKey2).set(primaryKey, data._items)
}


/**
 * Upadate all products visualization. Useful to rescale all graphs
 */
function updateAllProducts() {
    productsGraphs.forEach(function(graph, primaryKey) {
        updateProductGraph(primaryKey)
    })
}

/**
 * Add a new product path
 * @param primaryKey name of the graph to update
 */
function updateProductGraph(primaryKey) {
    var secondaryKey1 = getSecondaryKey1()
    var secondaryKey2 = getSecondaryKey2()
    if (! productsGraphs.get(primaryKey).get("view")) { // The poduct view is disable
        hideGraph(primaryKey)
    }
    else if (! isThereData(primaryKey, secondaryKey1, secondaryKey2)) { // The product view is enable but there is no data
        console.log("Not available data for " + primaryKey + " " + secondaryKey1 + " " + secondaryKey2)
    }
    else { // Starting visualizing the data
        drawGraph(primaryKey)
    }
}

/**
 * Hide a graph
 * @param primaryKey name of the graph to hide
 */
function hideGraph(primaryKey) {
    console.log("Hidding " + primaryKey)
    productsGraphs.get(primaryKey).get("path").attr("visibility", "hidden")
    productsGraphs.get(primaryKey).get("label").attr("visibility", "hidden")
}

/**
 * Draw a path graph
 * @param primaryKey name of the graph to hide
 */
function drawGraph(primaryKey) {
    var data = productsData.get(getSecondaryKey1()).get(getSecondaryKey2()).get(primaryKey)
    var path = productsGraphs.get(primaryKey).get("path")
    var label = productsGraphs.get(primaryKey).get("label")
    var color = d3.interpolateSinebow((productsGraphs.get(primaryKey).get("id")+1)/productsGraphs.size)

    console.log("Preparing to draw " + primaryKey)
    path.attr("visibility", "visible")
    label.attr("visibility", "visible")
    year = data[0]["Año"]

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

    path
        .datum(data)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(new Date(year, d.Mes-1)) })
            .y(function(d) { return yScale(d[field]) })
        )

    label
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + (width+3) + "," + yScale(data[data.length-1][field]) + ")")
        .style('fill', color)
        .text(data[0][model["primaryKey"]])
}

/**
 * Return the Y scale based in the current data
 */
function getYScale() {
    var newMaxY = 0
    productsData.get(getSecondaryKey1()).get(getSecondaryKey2()).forEach(function(data, primaryKey) {
        if (productsGraphs.get(primaryKey).get("view") && newMaxY < d3.max(data, d => d[field])) {
            newMaxY = d3.max(data, d => d[field])
        }
    })
    var yScale = d3.scaleLinear()
      .domain([0, newMaxY])
      .range([height, 0])
    return yScale
}

/**
 * Get value of secondary key 1
 */ 
function getSecondaryKey1() {
    return getOptionValue(model["secondaryKey1"])
}

/**
 * Get value of secondary key 2
 */ 
function getSecondaryKey2() {
    console.log("Searching for: " + model["secondaryKey2"])
    return getOptionValue(model["secondaryKey2"])
}

/**
 * Return value of option keyName from the form
 * @param keyName Name of the form
 */
function getOptionValue(keyName) {
    var optionValue = d3.select("#" + keyName).select('select').property('value')
    if (keyName == "Año") {
        optionValue = parseInt(optionValue)
    }
    return optionValue
}

createBasicStructure()

