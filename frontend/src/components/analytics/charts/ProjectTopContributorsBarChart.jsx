import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ProjectTopContributorsBarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = ref.current.parentElement.offsetWidth;
    const height = 220; // Increased height to accommodate the legend
    const margin = { top: 20, right: 20, bottom: 60, left: 60 }; // Adjusted bottom margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerWidth])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, Math.ceil(d3.max(data, d => d.hours))]) // Total tasks as the height
        .range([innerHeight, 0]);

    // Add X-axis
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

    // Add label to Y-axis
    g.append('g')
        .call(d3.axisLeft(y).ticks(y.domain()))
        .append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .text('Hours Contributed');

    // Add bars for each group
    const barGroups = g.selectAll('.bar-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bar-group');

    // Bars for each employee
    barGroups.append('rect')
        .attr('class', 'bar-hours')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.hours))
        .attr('height', d => innerHeight - y(d.hours))
        .attr('fill', '#4CAF50');

    // Add value text
    barGroups.append('text')
        .attr('class', 'value')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.hours) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.hours)
        .style('fill', '#333')
        .style('font-size', '10px')
        .style('font-weight', 'bold');
  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default ProjectTopContributorsBarChart;