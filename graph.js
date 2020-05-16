const simulation = d3.forceSimulation();

let links;
let nodes;

function resize_graph()
{
    let svg_graph = d3.select("#graph");
    let width = window.innerWidth;
    let height = window.innerHeight;

    svg_graph.attr("width", width);
    svg_graph.attr("height", height);
}

function create_graph() {

    let width = window.innerWidth;
    let height = window.innerHeight;

    let svg_graph = d3.select("#graph");

    svg_graph.attr("width", width);
    svg_graph.attr("height", height);

    let g = svg_graph.append("g")
        .attr("class", "everything");

    //add zoom capabilities
    let zoom_handler = d3.zoom()
        .on("zoom", function() {g.attr("transform", d3.event.transform);}).wheelDelta(function() {return (d3.event.deltaMode !== 1) ? -d3.event.deltaY * 0.0004 : -d3.event.deltaY * 0.02;});

    zoom_handler(svg_graph);

    links = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value);
        })
        .attr("stroke", "#222222")
        .style("opacity", 0.2);

    nodes = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter().append("g");

    nodes.append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
            return color(d.group);
        });

    nodes.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3)
        .style("font-size", "5px");

    nodes.append("title")
        .text(function (d) {
            return d.id;
        });

    simulation
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


    simulation.force("link").strength(0.05).distance(function(d) {
            return d.value;}
    );


    let max_links = [];

    let index = 0;
    for(let i = 0; i < data.nodes.length; i++) {
        for(let j = i+1; j < data.nodes.length; j++) {

            // building a temporary link between the two nodes
            let link = {};
            link.target = data.nodes[i];
            link.source = data.nodes[j];
            link.id = index;
            index = index+1;
            max_links.push(link);
        }
    }

    simulation.force("repulsion", d3.forceLink().id(function (d) {
            return d.id;
        }));
    simulation.force("repulsion").strength(0);

    function ticked() {
        links
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    simulation.force("repulsion")
        .links(max_links);
}
