PRODUCTS = [
    "Aceitunas",
    "Huevos kg",
]


var region = "Andalucía"
var year = "2004"
var field = "volume"

var productOptions = d3.select("#productDropdown")

productOptions
    .append("select")
    .on('change', drawProduct)
    .attr("id", "products")
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

drawProduct()

function drawProduct(){
    selectedProduct =
	productOptions.select("select").property("value")
    printGraph(selectedProduct, region, year, field)
}

