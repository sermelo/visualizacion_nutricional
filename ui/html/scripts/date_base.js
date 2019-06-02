var model = {
    "primaryKey": "Año",
    "secondaryKey1": "Producto",
    "secondaryKey2": "Región",
}

function printDates(data) {
    var data = data._items
    var options = d3.select("#Año").append("select").attr("multiple", "multiple")
    options
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d._id
        })
        .text(function(d){
            return d._id
        })
        .on("dblclick", function(d){
            updateGraph(parseInt(this.value))
        })
}

function printProducts(data) {
    var data = data._items
    options = d3.select("#Producto").append("select").on('change',changeSecondaryOption)
    options
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d._id
        })
        .text(function(d){
            return d._id
        })
}

function printRegions(data) {
    data = data._items
    options = d3.select("#Región").append("select").on('change',changeSecondaryOption)
    options
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d._id
        })
        .text(function(d){
            return d._id
        })
}

getUniqProducts(printProducts)
getUniqRegions(printRegions)
getUniqYears(printDates)

