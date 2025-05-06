import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HorizontalBarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    // Sort descending order
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const width = ref.current.parentElement.offsetWidth;
    const height = 180;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
      .domain(sortedData.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.1);

    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.value)])
      .range([0, innerWidth]);

    g.append('g').call(d3.axisLeft(y));
    g.append('g').call(d3.axisTop(x));

    const barGroups = g.selectAll('.bar-group')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group');

    barGroups.append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.label))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', '#4BC0C0')
      .on('mouseenter', function() {
        d3.select(this).attr('fill', '#3AA3A3');
        d3.select(this.parentNode).select('text.value')
          .style('opacity', 1);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', '#4BC0C0');
        d3.select(this.parentNode).select('text.value')
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.value));

    // add value text
    barGroups.append('text')
      .attr('class', 'value')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '0.35em') 
      .text(d => d.value)
      .style('fill', '#333')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('opacity', 0);

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default HorizontalBarChart;