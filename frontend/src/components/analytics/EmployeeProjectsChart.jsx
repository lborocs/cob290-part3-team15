import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmployeeProjectsChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    // Sort by task count descending
    const sortedData = [...data].sort((a, b) => b.tasks - a.tasks);

    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Y-axis (projects)
    const y = d3.scaleBand()
      .domain(sortedData.map(d => d.project))
      .range([0, innerHeight])
      .padding(0.2);

    // X-axis (task count)
    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.tasks)])
      .range([0, innerWidth]);

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y));

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Tasks Contributed');

    // Add bars
    g.selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.project))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', '#FF9F40')
      .on('mouseenter', function(_, d) {
        d3.select(this).attr('fill', '#E67E22');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.tasks) + 10)
          .attr('y', y(d.project) + y.bandwidth() / 2)
          .attr('dy', '0.35em')
          .text(`${d.tasks} tasks`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', '#FF9F40');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.tasks));

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default EmployeeProjectsChart;