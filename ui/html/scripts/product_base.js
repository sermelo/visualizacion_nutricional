var model = {
    "primaryKey": "Producto",
    "secondaryKey1": "Año",
    "secondaryKey2": "Región",
}

function printProducts(data) {
    var data = data._items
    var options = d3.select("#Producto").append("select").attr("multiple", "multiple").on('change',changeSecondaryOption)
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
            updateGraph(this.value)
        })
}

function printYears(data) {
    var data = data._items
    var options = d3.select("#Año").append("select").on('change',changeSecondaryOption)
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
    var data = data._items
    var options = d3.select("#Región").append("select").on('change',changeSecondaryOption)
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

getUniqYears(printYears)
getUniqRegions(printRegions)
getUniqProducts(printProducts)

