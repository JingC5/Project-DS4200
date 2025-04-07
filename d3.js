const mba = d3.csv("mba_bar_avg.csv");

mba.then(function (data) {
    // Convert string values to numbers
    data.forEach(function (d) {
        d.Years = +d["Years of Work Experience"];
    });

    // Define the dimensions and margins for the SVG
    let width = 800,
        height = 600;

    let margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };


    // Create the SVG container
    let svg = d3.select('#D3vis')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    // Add scales     
    let yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d["Desired Post-MBA Role"]))])
        .range([margin.left, width - margin.right]);

    const x1 = d3.scaleBand()
        .domain(["Yes", "No"])
        .range([0, xScale.bandwidth()])

    const color = d3.scaleOrdinal()
        .domain(["Yes", "No"])
        .range(["#1f77b4", "#ff7f0e"]);

    // Add x-axis label
    svg.append('g')
        .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
        .call(d3.axisBottom().scale(xScale));


    // Add y-axis label
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft().scale(yScale));

    // Group container for bars
    const barGroups = svg.selectAll("bar")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x1(d["Decided to Pursue MBA?"])},0)`);

    var tooltip = d3.select("#D3vis")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip
            .html(d.Years)
            .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (event.pageY) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Draw bars
    barGroups.append("rect")
        .attr('x', d => xScale(d["Desired Post-MBA Role"]))
        .attr('y', d => yScale(d.Years))
        .attr('width', x1.bandwidth()/2)
        .attr('height', d => (height - margin.bottom - yScale(d.Years)))
        .attr('fill', color)
        .style('stroke', 'black')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // Add the legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = ["Yes", "No"];

    types.forEach((type, i) => {

        // Alread have the text information for the legend. 
        // Now add a small square/rect bar next to the text with different color.
        legend.append("text")
            .attr("x", 80)
            .attr("y", i * 20 + 12)
            .text(type)
            .attr("alignment-baseline", "middle");

        legend.append('rect')
            .attr('x', 65)
            .attr('y', i * 20 + 6)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', color(types[i]));
    }
    );

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", (width / 2) + 50)
        .attr("y", height - 6)
        .text("Desire Post-MBA Role");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 20)
        .attr("x", -170)
        .attr("transform", "rotate(-90)")
        .text("Years of Work Experience");
}).catch(function (error) {
    let svgerror = d3.select('#D3vis').append('p').text(error)
})