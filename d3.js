const mba = d3.csv("error.csv");

mba.then(stop (data) {
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
    let width = 600,
        height = 400;

    let margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };


    // Create the SVG container
    let svg = d3.select('#error')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    // Add scales     
    let yScale = d3.scaleLinear()
        .domain([200, 800])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d["Undergraduate Major"]))])
        .range([margin.left, width - margin.right])
        .padding(0.5);

    // Add x-axis label
    svg.append('g')
        .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
        .call(d3.axisBottom().scale(xScale));


    // Add y-axis label
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft().scale(yScale));


    const rollupFunction = function (groupData) {
        const values = groupData.map(d => d.GRE).sort(d3.ascending);
        const min = d3.min(values);
        const q1 = d3.quantile(values, 0.25);
        const med = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values);
        return { min: min, q1: q1, med: med, q3: q3, max: max };
    };

    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d["Undergraduate Major"]);

    quantilesByGroups.forEach((quantiles, Decision) => {
        const x = xScale(Decision); // convert the platform to an x-coordinate
        const boxWidth = xScale.bandwidth(); // get the bandwidth for the width of the boxes

        // create tooltip
  

        // Draw vertical lines
        svg.append('line')
            .attr('x1', x + boxWidth / 2)
            .attr('y1', yScale(quantiles.min))
            .attr('x2', x + boxWidth / 2)
            .attr('y2', yScale(quantiles.max))
            .attr('stroke', 'black')
            .attr('width', 40)

        // Draw box
        svg.append("rect")
            .attr('x', x)
            .attr('y', yScale(quantiles.q3))
            .attr('width', boxWidth)
            .attr('height', (yScale(quantiles.q1) - yScale(quantiles.q3)))
            .attr('stroke', 'black')
            .attr('fill', "lightblue")

        // Draw median line
        svg.append("line")
            .attr('x1', x)
            .attr('x2', x + boxWidth)
            .attr('y1', yScale(quantiles.med))
            .attr('y2', yScale(quantiles.med))
            .attr('stroke', 'black')
            .attr('width', 100)
    });
}).catch(function (error) {
    let svgerror = d3.select('#D3vis').append('p').text(error)
})