var model = {
    "primaryKey": "Producto",
    "secondaryKey1": "Año",
    "secondaryKey2": "Región",
}

PRODUCTS = [
    "Aceitunas",
    "Huevos (kg)",
    "Nueces",
]

var productOptions = d3.select("#productDropdown")

productOptions
    .append("select")
    .attr("id", "products")
    .attr("multiple", "multiple")
    .selectAll("option")
    .data(PRODUCTS)
    .enter()
    .append("option")
    .attr("value", function(d){
        return d;
    })
    .text(function(d){
        return d;
    })
    .on("dblclick", function(d){
        updateGraph(this.value)
    })

function printYears(data) {
    var years = data._items
    yearsOptions = d3.select("#Año").append("select").attr("id", "years").on('change',changeOption)
    //yearsOptions.append("option").attr("value", "interannual").text("Interannual")
    yearsOptions
        .selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d._id;
        })
        .text(function(d){
            return d._id;
        })
}

function printRegions(data) {
    var regions = data._items
    regionsOptions = d3.select("#Región").append("select").attr("id", "years").on('change',changeOption)
    regionsOptions
        .selectAll("option")
        .data(regions)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d._id;
        })
        .text(function(d){
            return d._id;
        })
}

getUniqYears(printYears)
getUniqRegions(printRegions)

