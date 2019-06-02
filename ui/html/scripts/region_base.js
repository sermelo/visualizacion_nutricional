var model = {
    "primaryKey": "Región",
    "secondaryKey1": "Producto",
    "secondaryKey2": "Año",
}

function printRegions(data) {
    var data = data._items
    var options = d3.select("#Región").append("select").attr("multiple", "multiple")
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
            changePrimaryOption(this.value)
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

function printYears(data) {
    data = data._items
    options = d3.select("#Año").append("select").on('change',changeSecondaryOption)
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
getUniqYears(printYears)

