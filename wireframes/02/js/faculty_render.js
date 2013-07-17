// TODO: changing the children() value might let group by interest
// https://github.com/mbostock/d3/wiki/Pack-Layout#wiki-children
var r = 500,
    w, h,
    color = d3.scale.category20c(),
    node,
    root,
    clicked = false,
    prev_k
;
w = h = r;
var u_color = d3.scale.ordinal().range(colorbrewer.Set3[7]);

// A layout object for circle packing
//  sets some default styles and padding
var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })
    .padding(2)
;

  var svg = d3.select(".faculty_by_unit").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("g");
      //.attr("transform", "translate(2,2)");
      //.attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");


  d3.json("d3_hbs/hbs_units.json", function(error, root) {
    // Create a heirarchical circle packing layout
    var nodes = pack.nodes(root);

    // export my data for other functions
    node_data = nodes;

    // Add Circle nodes for every Unit and Faculty memberĸ
    svg.selectAll("circle")
      .data(nodes)
      .enter()
        .append("circle")
          .attr("r", function(d) { return d.r; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .style("fill", function(d) {
            if (!d.children) {
              return color(d.name);
            }
            return u_color(d.name);
            })
          .on("click", zoom)
    ;
    //
    // Add Text elements for every faculty
    svg.selectAll("text")
        .data(nodes)
      .enter()
        .append("svg:text")
        // Only position and style nodes
        //.attr("x", function(d) { return d.x; })
        //.attr("y", function(d) { return d.y; })
        .attr("text-anchor", "middle")
        //.style("opacity", function(d) { return d.r > 200; })
        // TODO set opaci
        // Returns Faculty.name if there are no children (unit)
        .text(function(d) { return !d.children ? d.name : "" ; })
        // Make hidden texts invisibile until needed
        .style("opacity", function(d) { return 0; })
        .on("click", zoom)
    ;
        //.attr("dy", ".35em")

    var fac_list = d3.select("#faculty-list-container")
            .selectAll("li")
            .data(nodes.filter( function(d) {return d.depth === 1 ? d : 0; }))
              //.filter(function(d) { return d === 'Harvard Business School' ? 1 : 0 ;})
              .enter()
                //.filter(function(d, i) { return i ;})
                .append("li")
                .text(function(d) { return d.name;  })
                .on("click", zoom)

    ;



    //d3.select(self.frameElement).style("height", diameter + "px");
    // TODO: on zoom, center the element in a smaller viewport

    // TODO: consider making an entry and exit object to store contexts

    // enable click to zoom
    //d3.select(window).on("click", function() { zoom(root); });

    // TODO: add function to
    // - call zoom
    // - do an ajax call to get json book_list content
    // - load book_list template



  });

/*  for the clicked
 */
function zoom(d, i) {
  var k = r / d.r / 2,
      x = d3.scale.linear().range([0, r]),
      y = d3.scale.linear().range([0, r])
  ;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  // if the depth of this is 1 or 2
  // take d.name and apply it to 
  // every class=faculty-name
  // not ready to handle depth=1 yet
  if (d.depth === 2) {
    // replace faculty name with d.name
    console.log("Faculty leaf node, renaming everything to " + d.name);
    $(".faculty-name").each(function(index) { $(this).text(d.name);});
    $(".ribbon").each(function(index) { $(this).text(d.name);});
    // replace unit-name with d.parent.name
    $(".unit-name").each(function(index) { $(this).text(d.parent.name); } );
    // show book-list-faculty
    $('#book-list-faculty').show();
    // replace sidebar with faculty-info-box
    $("#academic-units-box").hide();
    $("#faculty-info-box").show();

  } else if (d.depth === 1) {
    // an Academic Unit was clicked
    $("#faculty-info-box").hide();
    $("#academic-units-box").show();
    // TODO: add class=active to the academic unit clicked
  } else if (d.depth === 0) {
    $("#faculty-info-box").hide();
    $("#academic-units-box").show();
  }

  // build a transition object to contain
  // types of transitions for different selections
  var t = svg.transition().duration( 750 );

  t.selectAll("circle")
      //.attr("cx", function(d) { return clicked ? x(d.x) : x.invert(d.x) ; })
      //.attr("cy", function(d) { return clicked ?  y(d.y) : y.invert(d.y)  ; })
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      // TODO: set padding on circle?
      .attr("r", function(d) { return k * d.r ; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > 50 ? 1 : 0; })
      //.style("opacity", 0)
  ;
      //.style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });


  // TODO: load the book list page
  //
  function loadBookList() {
    // Hide the current page contents
    $('#faculty_table').hide();
    $('#book_list').show();
  }
  loadBookList();
  node = d;
  d3.event.stopPropagation();
}
