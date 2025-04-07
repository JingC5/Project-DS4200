const mba = d3.csv("mba_decision_dataset.csv");

mba.then(function (data) {
    // Convert string values to numbers
    data.forEach(function (d) {
        d.Age = +d.Age;
        d.Years = +d["Years of Work Experience"];
        d.ActualSalary = +d["Annual Salary (Before MBA)"];
        d.GRE = +d["GRE/GMAT Score"];
        d.UndergradRanking = +d["Undergrad University Ranking"];
        d.Entrepreneurial = +d["Entrepreneurial Interest"];
        d.Networking = +d["Networking Importance"];
        d.ExpectedSalary = +d["Expected Post-MBA Salary"];
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
        .domain([20, 35])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleLinear()
        .domain([0, 10])
        .range([margin.left, width - margin.right]);

    const x1 = d3.scaleBand()
        .domain(["Yes", "No"])
        .range([0, 1])

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
    const dotGroups = svg.selectAll("dot")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x1(d["Decided to Pursue MBA?"])},0)`);

    var tooltip = d3.select("#DSvis")
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
            .html(d.Age)
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


    // Add dots
    dotGroups.append('g')
        .selectAll("dot")
        .data(data.filter(function (d, i) { return i < 50 })) // the .filter part is just to keep a few dots on the chart, not all of them
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.Years) })
        .attr("cy", function (d) { return yScale(d.Age) })
        .attr("r", 7)
        .style("fill", color)
        .style("opacity", 0.3)
        .style("stroke", "white")
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
        .text("Years of Experience");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 20)
        .attr("x", -170)
        .attr("transform", "rotate(-90)")
        .text("Age (Years)");
}).catch(function (error) {
    let svgerror = d3.select('#D3vis').append('p').text(error)
})