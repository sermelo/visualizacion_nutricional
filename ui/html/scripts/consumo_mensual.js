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
var productsData = new Map();

/**
 * Construct query Http call
 * @param dataProduct The product to query
 * @param dataRegion The region to query
 * @param dataYear The year to query
 * @param fieldSortName the desired field to query
 */
function updateGraph(dataProduct, dataRegion, dataYear, fieldSortName) {
    field = fieldsMap[fieldSortName]
    product = dataProduct
    region = dataRegion
    year = dataYear
    if (! productsData.has(product)) {
        console.log("Adding new product: " + product)
        requestProductData(product, region, year, field, dataToGraph)
    }
    else if (! productsData.get(product).get("view")) {
        console.log("Activating an already requested product: " + product)
        productsData.get(product).set("view", true)
        updateAllProducts()
    }
    else {
        console.log("Deactivating a product: " + product)
        productsData.get(product).set("view", false)
        updateAllProducts()
    }
}

function changeYear() {
    year = d3.select("#dateList").select('select').property('value')
    console.log("Change year:" + year)
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
    newProductValues = new Map([["data", data._items], ["container", container.append("path")], ["view", true]])
    productsData.set(product, newProductValues)
    updateAllProducts()
}

/**
 * Add a new product path
 * @param data data to show
 */
function addProductPath(product) {
    var productPath = product.get("container")
    var data = product.get("data")

    var xScale = d3.scaleTime()
       .domain([new Date(year, 0), new Date(year, 11)])
       .range([margin.left, width]);
    xAxisContainer
       .transition()
       .duration(1000)
       .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))

    var yScale = getYScale()
    yAxisContainer
       .transition()
       .duration(1000)
       .call(d3.axisLeft(yScale))
    productPath
        .datum(data)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(new Date(year, d.Mes-1)) })
            .y(function(d) {
                if (product.get("view")) {
                    yValue = d[field]
                } else {
                    yValue = 0
                }
                return yScale(yValue)
            })
        )
}

/**
 * Rescale product to current scale
 */
function updateAllProducts() {
    productsData.forEach(addProductPath)
}

/**
 * Return the Y scale based in the current data
 */
function getYScale() {
    var newMaxY = 0
    productsData.forEach(function(product) {
        var data = product.get("data")
        if (product.get("view") && newMaxY < d3.max(data, d => d[field])) {
            newMaxY = d3.max(data, d => d[field])
        }
    })
    var yScale = d3.scaleLinear()
      .domain([0, newMaxY])
      .range([height, 0])
    return yScale
}

createBasicStructure()
