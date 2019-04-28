var product = "Aceitunas"
var region = "Andalucía"
var year = "2004"
var field = "Volumen (miles de kg)"

// Prepare API query
function getUrl() {
    var baseUrl = 'http://localhost:5000/test2'
    var filter = '{"Producto":"' + product + '","Región":"' + region + '","Año":"' + year + '"}'
    var projection = '{"' + field + '":1,"Mes":1,"Producto":0,"Categoría":0}'
    var dataUrl = encodeURI(baseUrl + '?max_results=300&where=' + filter + '&projection=' + projection);
    return dataUrl
}
// Do API query to get the data 
d3.json(getUrl()).then(showData)

//d3.json("https://output.jsbin.com/hekavo/12.js").then(showData)

function showData(data) {
    // Define the title
    d3.select('body').append('div').text(field + " de " + product + " en " + region + " en " + year)
	
    // Get only relevant data
    var monthsData = data._items

    // Define the values domain
    var domain = d3.extent(monthsData, d => d[field])

    // Define font size and color scales
    var fontSizeScale = d3.scaleLinear().domain(domain).range([12, 40])
    var colorScale = d3.scaleLinear().domain(domain).range(["grey", "green"])

    // Print the data
    var elementoUl = d3.select("body").append("ul")
    elementoUl.selectAll("li")
              .data(monthsData)
	      .enter()
	      .append("li")
	      .text(d => d.Mes)
	      .style("font-size", d => fontSizeScale(d[field]))
	      .style("color", d => colorScale(d[field]))
}
