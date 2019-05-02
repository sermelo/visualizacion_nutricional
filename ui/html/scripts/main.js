products = [
    "Aceitunas",
    "Huevos kg",
]
var productOptions = d3.select("#productDropdown")

productOptions
    .append("select")
    .selectAll("option")
    .data(products)
    .enter()
    .append("option")
    .attr("value", function(d){
        return d;
    })
   .text(function(d){
        return d;
    })

var product = "Aceitunas"
var region = "Andalucía"
var year = "2004"
var field = "volume"
printGraph(product, region, year, field)

