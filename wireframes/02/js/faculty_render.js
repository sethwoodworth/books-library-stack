// TODO: changing the children() value might let group by interest
// https://github.com/mbostock/d3/wiki/Pack-Layout#wiki-children
var w = 640,
    h = 640,
    r = 640,
    color = d3.scale.category20c(),
    node,
    root
;

// A layout object for circle packing
//  sets some default styles and padding
var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })
    .padding(3)
;

  var svg = d3.select(".faculty_by_unit").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("g")
      //.attr("transform", "translate(2,2)");
      .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

  /*
   *var fac_list = d3.selectAll("#faculty-list")
   *                  .append('ul')
   *                  .attr("id", "faculty-list-container")
   *;
   */

  d3.json("d3_hbs/hbs_units.json", function(error, root) {
    // Create a heirarchical circle packing layout
    var nodes = pack.nodes(root);

    // Add Circle nodes for every Unit and Faculty memberĸ
    svg.selectAll("circle")
      .data(nodes)
      .enter()
        .append("circle")
          .attr("r", function(d) { return d.r; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .style("fill", function(d) { return color(d.name); })
          .on("click", zoom)
    ;
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



    //d3.select(self.frameElement).style("height", diameter + "px");
    // TODO: on zoom, center the element in a smaller viewport

    // TODO: consider making an entry and exit object to store contexts

    // enable click to zoom
    //d3.select(window).on("click", function() { zoom(root); });

    // TODO: add function to
    // - call zoom
    // - do an ajax call to get json book_list content
    // - load book_list template


/*
 *
 *    // FIXME: faculty list
 *    function flattenNodes(element, index) {
 *        if (element.children){
 *          console.log("Not a leaf: " + element.name);
 *          flattenNodes(element.children);
 *        } else {
 *          //console.log("A leaf in the wind: " + element.name);
 *          return element;
 *        }
 *      }
 *
 *    g_n = nodes;
 *    // TODO: Load node data into faculty-list element
 *    fac_list.selectAll("li")
 *      .data(function(){
 *        return [nodes.forEach(flattenNodes)];
 *      })
 *      .enter()
 *        .append("li")
 *        .text(function(d) { return d.name; })
 *    ;
 */

  });

/*  for the clicked
 */
function zoom(d, i) {
  // What am I applying the scale

  var k = r / d.r / 2,
  x = d3.scale.linear().range([0, r]),
  y = d3.scale.linear().range([0, r])
  ;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);
  //
  // TRY appending the text only on click
  d3.select(this).append("svg:text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { return d.r > 200; })
        .text(function(d) { return d.name; })
  ;


  // build a transition object to contain
  // types of transitions for different selections
  var t = svg.transition().duration( 750 );


  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      // TODO: set padding on circle?
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return 1; });
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
