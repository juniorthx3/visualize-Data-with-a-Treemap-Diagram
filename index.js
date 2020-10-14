const svg=d3.select("svg"), padding=200;
const width=svg.attr("width"), height=svg.attr("height");
const g=svg.append("g").attr("transform","translate("+ 0 +","+ 0 +")"); 
const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
 .then(response=>response.json())
 .then(data =>{
    const dataMovie=data;
    const treeMap=d3.treemap().size([width, height]).padding(1);
    let hierachy=d3.hierarchy(dataMovie, d=>d['children'])
                   .sum(d=>d["value"])
                   .sort((d1, d2)=>d2['value'] - d1["value"]);
   treeMap(hierachy);
  
   let group=g.selectAll("g").data(hierachy.leaves()).enter().append("g");
  //RECT
   group.attr("transform", d=>'translate('+ d['x0'] +','+ d['y0'] +')')
        .append("rect")
        .attr("class","tile")
        .attr("fill", d=>colorScale(d["data"]["category"]))
        .attr("data-name", d =>d["data"]["name"])
        .attr("data-category", d=>d["data"]["category"])
        .attr("data-value", d=>d["data"]["value"])
        .attr("width", d=>d['x1'] - d['x0'])
        .attr("height", d=>d['y1'] - d['y0'])
        .on("mouseover", d=> { 
            tooltip.style("opacity", 0.9)
            tooltip.html("Name: "+ d['data']["name"] + '<br />' + "Category: "+ d['data']["category"] + "<br />"+ "Value: "+ d['data']["value"])
                   .attr("data-value", d["data"]["value"])
                   .style("left", d3.event.pageX + "px")
                   .style("top", d3.event.pageY - 28 + "px")
        })   
       .on("mouseout", d => {
            tooltip.style("opacity", 0);
        })
  //lABEL
  group.append("text")
       .selectAll("tspan")
       .data(d=>d["data"]["name"].split(/(?=[A-Z][^A-Z])/g))
       .enter()
       .append("tspan")
       .attr("x", 1)
       .attr("y", (d, i)=> 12 + i * 8)
       .text(d=>d);
  
  let category=hierachy.leaves().map(d=>d["data"]["category"]).filter((d, i, s)=>s.indexOf(d) === i);
  //LEGEND
     g.append("g")
        .attr("transform","translate(1005, 200)")
        .attr("id","legend")
        .selectAll("rect")
        .data(category)
        .enter()
        .append("rect")
        .attr("class","legend-item")
        .attr("fill", d=>colorScale(d))
        .attr("y", (d, i)=> i * 40)
        .attr("width", 30)
        .attr("height", 30);
  
      g.append("g")
        .attr("transform","translate(1040, 215)")
        .selectAll("text")
        .data(category)
        .enter()
        .append("text")
        .attr("x", 1)
        .attr("y", (d, i)=> 1 + i * 40)
        .attr("style","font-size:11px;text-transform : uppercase")
        .text(d=>d)
      
})
     