import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        const x = d3
            .scalePoint()
            .domain(data.map((d) => d.employee))
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.hours)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3
            .line()
            .x((d) => x(d.employee))
            .y((d) => y(d.hours))
            .curve(d3.curveMonotoneX);

        svg
            .attr("viewBox", [0, 0, width, height])
            .append("g")
            .call(d3.axisBottom(x))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg
            .append("g")
            .call(d3.axisLeft(y))
            .attr("transform", `translate(${margin.left},0)`);

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg
            .selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.employee))
            .attr("cy", (d) => y(d.hours))
            .attr("r", 4)
            .attr("fill", "steelblue");
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default LineChart;