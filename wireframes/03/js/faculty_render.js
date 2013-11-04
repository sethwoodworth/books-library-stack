// TODO: changing the children() value might let group by interest
// https://github.com/mbostock/d3/wiki/Pack-Layout#wiki-children
var r = 500,
    w, h,
    color = d3.scale.category20b(),
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
    .padding(0)
;

  // handle zoom and translate for the SVG.
  // zooming past 30 isn't meaningful.
  var zthandler = d3.behavior.zoom().scaleExtent([0,30]);

  var svg = d3.select(".faculty-by-unit").append("svg")
      .attr("width", '100%')
      .attr("height", h)
    .append("g")
      .call(zthandler.on("zoom", function () {
        var t = svg.transition().duration( 750 );
        t.selectAll("text").style("visibility", function (d) { return text_visibility(d, d3.event.scale) });
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }))

    .append("g")
      //.attr("transform", "translate(2,2)");
      //.attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")")
;

// define left alignment percentage. 1/3 means more left, 1/2 is centered, etc.
var left_align = 1/3;
// define top alignment percentage. 1/3 means more top, 1/2 is centered, etc.
var top_align = 1/2;

// determine optimal scale for zooming to the given object.
function scale_for(d) {
    // calculation derived from empirical observation.
    return 42*Math.pow(d.r, -0.6) - 0.6;
}
// determine optimal radius given a scale
function radius_for(scale) {
    // inverse of scale_for
    return Math.pow((scale + 0.6)/42, -1/0.6);
}

// constant of fuzz around when to display text based on zoom.
// fuzz must be greater than 0.
// too small and text will almost never show up, too big and multiple
// layers of bubbles will display text simultaneously.
var fuzz = 1.7;

// determine when text should be displayed based on bubble radius, current zoom
// level, and some amount of fuzz.
function text_visibility(d, scale) {
    var min_rad = radius_for(scale*fuzz);
    var max_rad = radius_for(scale/fuzz);
    if ((min_rad <= d.r) && (d.r <= max_rad)) return 'visible';
    else return 'hidden';
}

// font sizes for depths 0, 1, and 2.
var font_sizes = Object();
font_sizes[0] = 48;
font_sizes[1] = 10;
font_sizes[2] = 2;


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
            // root node: HBS
            if (!d.parent) {
              return '#ebe3d6';
            }
            // leaf nodes: Faculty
            if (!d.children) {
              //return '0bcce1'
              return color(d.name);
            }
            // When a unit or interest
            return '#ff4160'
            //return u_color(d.name);
            })
          //.on("click", zoom_to)
    ;
    //
    // Add Text elements for every faculty
    var svgtext = svg.selectAll("text")
      .data(nodes)
        .enter().append("svg:text")
        // Only position and style nodes
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("font-size", function (d) { return font_sizes[d.depth]; })
        .attr("text-anchor", "middle")
        // Show relevant text for initial zoom (initial zoom level is 1)
        .style("visibility", function (d) { return text_visibility(d, 1) })
    ;

    // Add word wrapped Tspan elements for every Text element above
    svgtext.selectAll("tspan")
        .data(function (d) {
          // associate parent data with each new string created
          textarray = wordwrap(d.name, 16, '\0').split('\0');
          objarray = [];
          for (i = 0; i < textarray.length; i++) {
            objarray[i] = Object();
            objarray[i].text = textarray[i];
            objarray[i].x = d.x;
            objarray[i].y = d.y;
            objarray[i].i = i;
          }
          // return each line of the text array
          return objarray;
        })
          // Returns label for the bubble, with some line wrapping formatted into tspans
          .enter().append('svg:tspan')
             .attr("x", function (d) { return d.x; })
             // 1em under the previous cursor unless it is the first line
             .attr("dy", function (d) { return (d.i == 0) ? "0em" : "1em"; })
             .text(function(d) { return d.text; } )
    ;

    var fac_list = d3.select("#faculty-list-container")
            .selectAll("li")
            .data(nodes.filter( function(d) {return d.depth === 1 ? d : 0; }))
              //.filter(function(d) { return d === 'Harvard Business School' ? 1 : 0 ;})
              .enter()
                //.filter(function(d, i) { return i ;})
                .append("li")
                .text(function(d) { return d.name;  })
                .on("click", zoom_and_highlight)

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

    // zoom to the root object and setup the right hand menu
    zoom_and_highlight(root);

  });

// zoom to the node and highlight it in the menu
function zoom_and_highlight(d) {
    zoom_to(d);
    menu_highlight(d);
}

// zoom to the given node object in the svg
function zoom_to(d) {
    var max = zthandler.size(); // [0,0] in one corner, this array in the diag
    var scale = scale_for(d);
    // honestly, I don't know why the math turned out precisely this way for
    // position. there was much guess and check. -btb
    var position = [(max[0] - scale * 2 * d.r) * 2*left_align - scale * (d.x - d.r),
                    (max[1] - scale * 2 * d.r) * top_align - scale * (d.y - d.r)];
    // BOOM! Update the SVG by calling zoom.event() after moving about
    zthandler.translate(position).scale(scale).event(svg);
}

// expand the given submenu with its contents
function menu_highlight(d) {
    var menu = d3.select("#svg-info-box ul.accordion").selectAll("li")
      .data(Array.concat([], d.parent, d, d.children)
        .filter(function (a) {return a ? a : null;}));
    // insert (new items)
    menu.enter().append("li")
      .text(function (d) {return d.name;})
      .on("click", zoom_and_highlight);
    // update (existing items)
    menu.text(function (d) {return d.name;});
    // delete (old items)
    menu.exit().remove();
}

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
      //.style("opacity", function(d) { return k * d.r > 50 ? 1 : 0; })
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

var data =
{"start": "-1", "limit": "0", "num_found": "2", "docs":
[
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  },
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  },
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  },
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  },
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  },
  {
      "title": "Blankets",
      "creator": [
          "Craig Thompson"
      ],
      "measurement_page_numeric": 582,
      "measurement_height_numeric": 25,
      "shelfrank": 13,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
  },
  {
      "title": "Persepolis",
      "creator": [
          "Marjane Satrapi"
      ],
      "measurement_page_numeric": 153,
      "measurement_height_numeric": 24,
      "shelfrank": 64,
      "pub_date": "2003",
      "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009098946"
  }
]
};

// load a horizontal stackview on page load
$('#horizontal-demo').stackView({data: data, horizontal: true});
