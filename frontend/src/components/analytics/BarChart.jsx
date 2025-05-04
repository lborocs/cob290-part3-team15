import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.tasksAssigned))]) // Total tasks as the height
      .range([innerHeight, 0]);

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Add Y-axis with label
    g.append('g')
      .call(d3.axisLeft(y).ticks(y.domain()[1]))
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Total Tasks Given');

    // Add bars with two colors (stacked)
    const barGroups = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group');

    // Not completed tasks (bottom part of the stack)
    barGroups.append('rect')
      .attr('class', 'bar-not-completed')
      .attr('x', d => x(d.label))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.tasksAssigned))
      .attr('height', d => innerHeight - y(d.tasksAssigned))
      .attr('fill', '#FF6384'); // Red for not completed

    // Completed tasks (top part of the stack)
    barGroups.append('rect')
      .attr('class', 'bar-completed')
      .attr('x', d => x(d.label))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.tasksCompleted))
      .attr('height', d => innerHeight - y(d.tasksCompleted))
      .attr('fill', '#4CAF50'); // Green for completed

    // Add value text
    barGroups.append('text')
      .attr('class', 'value')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.tasksAssigned) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.tasksAssigned) // Show total tasks
      .style('fill', '#333')
      .style('font-size', '10px')
      .style('font-weight', 'bold');

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 100}, 10)`);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#4CAF50'); // Green for completed

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text('Completed')
      .style('font-size', '12px')
      .style('fill', '#333');

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#FF6384'); // Red for not completed

    legend.append('text')
      .attr('x', 20)
      .attr('y', 32)
      .text('Not Completed')
      .style('font-size', '12px')
      .style('fill', '#333');
  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default BarChart;
