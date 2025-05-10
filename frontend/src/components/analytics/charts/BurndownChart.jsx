import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BurndownChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const width = ref.current.parentElement.offsetWidth - margin.left - margin.right;
    const height = ref.current.parentElement.offsetHeight - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.actual)])
      .range([height, 0]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Date");

    svg.append('g')
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Tasks Remaining");

    // Create line generator for the actual line
    const actualLine = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.actual));

    svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', height)
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2);

    // Add the actual line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FF6384')
      .attr('stroke-width', 2)
      .attr('d', actualLine);

    // Add dots for actual data points
    svg.selectAll('.dot-actual')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot-actual')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.actual))
      .attr('r', 4)
      .attr('fill', '#FF6384');

    // Add today's date vertical dashed line
    const today = new Date();
    if (today >= new Date(data[0].date) && today <= new Date(data[data.length - 1].date)) {
      svg.append('line')
        .attr('x1', x(today))
        .attr('y1', 0)
        .attr('x2', x(today))
        .attr('y2', height)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
    }

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 30)
      .attr('y2', 0)
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 40)
      .attr('y', 0)
      .attr('dy', '.35em')
      .text('Ideal Burndown')
      .style('font-size', '12px');

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 20)
      .attr('x2', 30)
      .attr('y2', 20)
      .attr('stroke', '#FF6384')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 40)
      .attr('y', 20)
      .attr('dy', '.35em')
      .text('Actual Burndown')
      .style('font-size', '12px');

  }, [data]);

  return <svg ref={ref} style={{ width: '100%', height: '200px' }} />;
};

export default BurndownChart;