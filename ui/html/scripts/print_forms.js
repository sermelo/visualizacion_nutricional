function printPrimary(data) {
    var data = data._items
    var options = d3.select("#" + model["primaryKey"]).append("select").attr("multiple", "multiple")
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

function printSecondary1(data) {
    printSecondary(data, model["secondaryKey1"])
}

function printSecondary2(data) {
    printSecondary(data, model["secondaryKey2"])
}

function printSecondary(data, name) {
    var data = data._items
    var options = d3.select("#" + name).append("select").on('change',changeSecondaryOption)
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

getUniqValues(model["primaryKey"], printPrimary)
getUniqValues(model["secondaryKey1"], printSecondary1)
getUniqValues(model["secondaryKey2"], printSecondary2)

