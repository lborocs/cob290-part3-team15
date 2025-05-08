import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmployeeHoursChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis (weeks)
    const x = d3.scaleBand()
      .domain(data.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.2);

    // Y-axis (hours)
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.hours) * 1.1])
      .range([innerHeight, 0]);

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Week');

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Hours Worked');

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.week))
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#36A2EB')
      .on('mouseenter', function(_, d) {
        d3.select(this).attr('fill', '#2980B9');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.week) + x.bandwidth() / 2)
          .attr('y', y(d.hours) - 5)
          .attr('text-anchor', 'middle')
          .text(`${d.hours} hrs`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', '#36A2EB');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.hours))
      .attr('height', d => innerHeight - y(d.hours));

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default EmployeeHoursChart;