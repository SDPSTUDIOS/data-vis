var w = 500;
var h = 600;
var padding = 25;


var smoking = new Map();

var projection = d3.geoMercator()
.scale(50)
.center([0,20])
.translate([w / 2, h / 2]);



var formatpercent = function(d) {
    return d3.format(',.02f')(d) + '%';
};

var formatnum = function(d) {
    //d = d/100;
    return d3.format(',.02f')(d) + ' per 100,000';
};

var map1 = d3.choropleth()
    .geofile('countries.json')
    .colors(d3.schemeBlues[9])
    .column('Smoking Population')
    .format(formatpercent)
    .unitId('iso3')
    .legend(true);


var map2 = d3.choropleth()
    .geofile('countries.json')
    .colors(d3.schemeReds[9])
    .column('Death Share')
    .format(formatpercent)
    .unitId('iso3')
    .legend(true);

var map3 = d3.choropleth()
    .geofile('countries.json')
    .colors(d3.schemeOranges[7])
    .column('Deaths')
    .format(formatnum)
    .unitId('iso3')
    .legend(true);


var selected = document.getElementById('selected').value;

if (selected == "dataset1"){
    d3.csv('dataset1.csv').then(data => {
        var selection = d3.select('#map').datum(data);
        map1.draw(selection);
        map1.svg.on("click", function(d){
            d3.selectAll("g.arc").remove();
            d3.selectAll("text.pie").remove();
            mouseOver(d);
        })
    });
} else if (selected == "dataset2"){
    d3.csv('dataset2.csv').then(data => {
        var selection = d3.select('#map').datum(data);
        map2.draw(selection);
        map2.svg.on("click", function(d){
            d3.selectAll("g.arc").remove();
            d3.selectAll("text.pie").remove();
            mouseOver(d);
        });
    });
} else if (selected == "dataset3"){
    d3.csv('dataset3.csv').then(data => {
        var selection = d3.select('#map').datum(data);
        map3.draw(selection);
        map3.svg.on("click", function(d){
            d3.selectAll("g.arc").remove();
            d3.selectAll("text.pie").remove();
            mouseOver(d);
        });
    })
}

function update(){
    var prev = selected;
    selected = document.getElementById('selected').value;
    if (selected == "dataset1"){
        if (prev == "dataset1"){
            map1.svg.remove();
        } else if (prev == "dataset2"){
            map2.svg.remove();
        } else if (prev == "dataset3"){
            map3.svg.remove();
        }
        d3.csv('dataset1.csv').then(data => {
            var selection = d3.select('#map').datum(data);
            map1.draw(selection);
            map1.svg.on("click", function(d){
                d3.selectAll("g.arc").remove();
                d3.selectAll("text.pie").remove();
                mouseOver(d);
            })
        });
    } else if (selected == "dataset2"){
        if (prev == "dataset1"){
            map1.svg.remove();
        } else if (prev == "dataset2"){
            map2.svg.remove();
        } else if (prev == "dataset3"){
            map3.svg.remove();
        }
        d3.csv('dataset2.csv').then(data => {
            var selection = d3.select('#map').datum(data);
            map2.draw(selection);
            map2.svg.on("click", function(d){
                d3.selectAll("g.arc").remove();
                d3.selectAll("text.pie").remove();
                mouseOver(d);
            })
        });
    } else if (selected == "dataset3"){
        if (prev == "dataset1"){
            map1.svg.remove();
        } else if (prev == "dataset2"){
            map2.svg.remove();
        } else if (prev == "dataset3"){
            map3.svg.remove();
        }
        d3.csv('dataset3.csv').then(data => {
            var selection = d3.select('#map').datum(data);
            map3.draw(selection);
            map3.svg.on("click", function(d){
                d3.selectAll("g.arc").remove();
                d3.selectAll("text.pie").remove();
                mouseOver(d);
            });
        });
    }
}


function mouseOver(d){
    d3.csv("dataset4.csv", function(data) {
        return{
          iso3: data.iso3,
          five: +data.five,
          fourteen: +data.fourteen,
          fortynine: +data.fortynine,
          sixtynine: +data.sixtynine,
          seventy: +data.seventy
        }
      })
      .then(function(data) {
        var w = 300;
        var h = 340;
        
        var outerRadius = w / 2;
        var innerRadius = 0;
        
        var arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);
        
        var pie = d3.pie();
        
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        let dataset = data.find(o=> o.iso3 == d.target.__data__.properties.iso3);
        var dataArray = [dataset.five, dataset.fourteen, dataset.fortynine, dataset.sixtynine, dataset.seventy];
        
        var svg = d3.select("#pie")
            .attr("width", w)
            .attr("height", h);
        
        var arcs = svg.selectAll("g.arc")
            .data(pie(dataArray))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate( " + outerRadius + ", " + outerRadius + ")");
        
        arcs.append("path")
            .attr("fill", function(d, i){
                return color(i);
            })
            .attr("d", function(d, i){
                return arc(d, i);
            })
        
        arcs.append("text")
            .text(function(d){
                if (d.value == dataset.five){
                    return "< 5";
                } else if (d.value == dataset.fourteen){
                    return "5 to 14";
                } else if (d.value == dataset.fortynine){
                    return "15 to 49";
                } else if (d.value == dataset.sixtynine){
                    return "50 to 69";
                } else if (d.value == dataset.seventy){
                    return "> 70";
                }

            })
            .attr("transform", function(d){
                return "translate(" + arc.centroid(d) + ")";
            })

        svg.append("text")
        .attr("class", "pie")
        .attr("x", (w / 2))             
        .attr("y", h - 20 )
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Death by Smoking Age Distribution in " + dataset.iso3);
      }
      )
  
}