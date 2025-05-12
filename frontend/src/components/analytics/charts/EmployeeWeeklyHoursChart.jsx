import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmployeeWeeklyHoursChart = ({ data }) => {
  const ref = useRef();
  const width = 468;
  const height = 220;

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Reverse the data array to ensure the first entry is the earliest week
    const reversedData = [...data].reverse();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)

    svg.selectAll('*').remove();

    // Transform data
    const processedData = reversedData.map(d => ({
      ...d,
      week: d.weekStart,
      hours: Number(d.hours) || 0,
    }));

    // Calculate cumulative hours
    const cumulativeData = processedData.map((d, i) => ({
      ...d,
      cumulativeHours: processedData.slice(0, i + 1).reduce((sum, item) => sum + item.hours, 0),
    }));

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis (weeks)
    const x = d3.scalePoint()
      .domain(processedData.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.5);

    // Y-axis (hours)
    const y = d3.scaleLinear()
      .domain([0, d3.max(cumulativeData, d => d.cumulativeHours) * 1.1])
      .range([innerHeight, 0])
      .nice();

    // Add X-axis with animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('opacity', 0)
      .call(d3.axisBottom(x));
    
    xAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add Y-axis with animation
    const yAxis = g.append('g')
      .attr('opacity', 0)
      .call(d3.axisLeft(y));
    
    yAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add axis labels
    g.append('text')
      .attr('x', innerWidth / 2 - 15)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .text('Week Start')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Hours Worked')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Bar width calculation
    const barWidth = innerWidth / processedData.length * 0.6;

    // Add bars with animation
    g.selectAll('.bar')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.week) - barWidth / 2)
      .attr('y', innerHeight) // Start from bottom
      .attr('width', barWidth)
      .attr('height', 0) // Start with 0 height
      .attr('fill', '#74C476')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#4CAF50');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.week))
          .attr('y', y(d.hours) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.hours} hrs`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#74C476');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .delay((_, i) => i * 100) // Staggered delay
      .duration(500)
      .attr('y', d => y(d.hours))
      .attr('height', d => innerHeight - y(d.hours));

    // Line generator for cumulative hours
    const line = d3.line()
      .x(d => x(d.week))
      .y(d => y(d.cumulativeHours))
      .curve(d3.curveMonotoneX);

    // Add line path with animation
    const path = g.append('path')
      .datum(cumulativeData)
      .attr('fill', 'none')
      .attr('stroke', '#36A2EB')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', function() { return this.getTotalLength() })
      .attr('stroke-dashoffset', function() { return this.getTotalLength() })
      .attr('d', line);

    path.transition()
      .delay(processedData.length * 100 + 200) // Start after bars
      .duration(1000)
      .attr('stroke-dashoffset', 0);

    // Add circles for data points with animation
    const dots = g.selectAll('.dot')
      .data(cumulativeData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.week))
      .attr('cy', innerHeight) // Start from bottom
      .attr('r', 0) // Start with radius 0
      .attr('fill', '#36A2EB')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#2980B9');
        g.append('text')
          .attr('class', 'dot-tooltip')
          .attr('x', x(d.week))
          .attr('y', y(d.cumulativeHours) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.cumulativeHours} hrs`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#36A2EB');
        g.selectAll('.dot-tooltip').remove();
      });

    dots.transition()
      .delay((_, i) => processedData.length * 100 + 200 + i * 100) // Stagger after line
      .duration(500)
      .attr('cy', d => y(d.cumulativeHours))
      .attr('r', 4);

  }, [data]);

  return <svg ref={ref} viewBox={`0 0 ${width} ${height}`} />;
};

export default EmployeeWeeklyHoursChart;