var width = 960,
    height = 500;
 
    
function draw() {
    var data = {
        "nodes":[
            {"x":400, "y": 127, "r":80, "label":"Años", "url": "visual_date.html"}, 
            {"x":300, "y": 300, "r":80, "label":"Productos", "url": "visual_product.html"}, 
            {"x":500, "y": 300, "r":80, "label":"Regiones", "url": "visual_regions.html"},
	]
    }

    var div = d3.select("body").select("#circles_graph")
    div.text("Elige elementos que comparar") 
    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height)

    var elem = svg.selectAll("g myCircleText")
        .data(data.nodes)
  
    var elemEnter = elem.enter()
	    .append("g")
	    .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
 
    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
	    .attr("r", function(d){return d.r} )
	    .attr("stroke","black")
	    .attr("fill", "white")
	    .on("dblclick", function(d){
                window.location = d.url
            })
 
    /* Create the text for each block */
    elemEnter.append("text")
	    .attr("dx", function(d){return -20})
	    .text(function(d){return d.label})
}

draw()

