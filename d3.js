const mba = d3.csv("mba_bar_avg.csv");

mba.then(function (data) {
    // Convert string values to numbers
    data.forEach(function (d) {
        d.Years = +d["Years of Work Experience"];
    });

    // Define the dimensions and margins for the SVG
    let width = 800,
        height = 400;

    let margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };


    // Create the SVG container
    let svg = d3.select('#d3vis')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    // Add scales     
    let yScale = d3.scaleLinear()
        .domain([4, 5])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d["Desired Post-MBA Role"]))])
        .range([margin.left, width - margin.right]);

    const x1 = d3.scaleBand()
        .domain(["No", "Yes"])
        .range([0, xScale.bandwidth()])

    const color = d3.scaleOrdinal()
        .domain(["No", "Yes"])
        .range(["#ff0000", "#0000ff"]);

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

    var tooltip = d3.select("#d3vis")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")

    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
            .style("stroke-width", 2);
    }

    var mousemove = function (d) {
        place = Math.floor(((event.pageX / 90) - 3.8) * (9/7))
        rounded = Math.round(data[place].Years * 100) / 100
        tooltip
            .html("The average age is: " + rounded)
            .style("left", (event.pageX) + 10 + "px") 
            .style("top", (event.pageY) + "px")
    }

    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 0.8)
            .style("stroke-width", 1);
    }

    // Draw bars
    barGroups.select("rect").data(data).enter().append("rect")
        .attr('x', d => xScale(d["Desired Post-MBA Role"]) + x1(d["Decided to Pursue MBA?"]))
        .attr('y', d => yScale(d.Years))
        .attr('width', x1.bandwidth())
        .attr('height', d => (height - margin.bottom - yScale(d.Years)))
        .attr('fill', color)
        .style('stroke', 'black')
        .style('opacity', 0.8)
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
        .attr("x", (width / 2) + 95)
        .attr("y", height - 6)
        .text("Desired Post-MBA Role");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 20)
        .attr("x", -120)
        .attr("transform", "rotate(-90)")
        .text("Years of Work Experience");
}).catch(function (error) {
    let svgerror = d3.select('#d3vis').append('p').text(error)
})