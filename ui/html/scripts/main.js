PRODUCTS = [
    "Aceitunas",
    "Huevos kg",
    "Frutos secos, nueces",
]


var region = "Andalucía"
var year = "2004"
var field = "volume"

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
    .on("click", function(d){
        updateGraph(this.value, this.selected, region, year, field)
    })
}

