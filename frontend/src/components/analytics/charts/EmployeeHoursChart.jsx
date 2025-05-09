import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmployeeHoursChart = ({ data }) => {
  const ref = useRef();

  console.log('Chart data:', data);

  useEffect(() => {
    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Transform data: use weekStart and set hours to 0 if null
    data = data.map(d => ({
      ...d,
      week: d.weekStart,
      hours: Number(d.hours) || 0,
    }));

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate cumulative hours for the line graph
    const cumulativeData = data.map((d, i) => ({
      ...d,
      cumulativeHours: data.slice(0, i + 1).reduce((sum, item) => sum + item.hours, 0),
    }));

    // X-axis (weeks)
    const x = d3.scalePoint()
      .domain(data.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.5);

    // Y-axis (hours)
    const y = d3.scaleLinear()
      .domain([0, d3.max(cumulativeData, d => d.cumulativeHours) * 1.1])
      .range([innerHeight, 0]);

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Week Start');

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Hours Worked');

    // Add bars (weekly hours)
    const barWidth = innerWidth / data.length * 0.6; // Adjust bar width as needed
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.week) - barWidth / 2)
      .attr('y', d => y(d.hours))
      .attr('width', barWidth)
      .attr('height', d => innerHeight - y(d.hours))
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
      });

    // Line generator (cumulative hours)
    const line = d3.line()
      .x(d => x(d.week))
      .y(d => y(d.cumulativeHours))
      .curve(d3.curveMonotoneX);

    // Add line path
    g.append('path')
      .datum(cumulativeData)
      .attr('fill', 'none')
      .attr('stroke', '#36A2EB')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add circles for data points (cumulative hours)
    g.selectAll('.dot')
      .data(cumulativeData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.week))
      .attr('cy', d => y(d.cumulativeHours))
      .attr('r', 4)
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

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default EmployeeHoursChart;