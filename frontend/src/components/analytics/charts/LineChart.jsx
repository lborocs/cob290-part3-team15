import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Dimensions and margins
    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Color
    const colors = {
      background: '#ffffff',
      line: '#6366f1',
      dot: '#6366f1',
      dotHover: '#4f46e5',
      axis: '#6b7280',
      tooltipBg: '#1f2937',
      tooltipText: '#f9fafb'
    };

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', colors.background)
      .style('border-radius', '8px');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.employee))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.hours) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Line generator
    const line = d3.line()
      .x(d => x(d.employee) + x.bandwidth() / 2)
      .y(d => y(d.hours))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat('')
        .tickValues(y.ticks(5))
      )
      .selectAll('line')
      .style('stroke', '#e5e7eb')
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.5);

    // Draw the line path with animation
    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.line)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    const totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);

    // Add circles with animation
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.employee) + x.bandwidth() / 2)
      .attr('cy', innerHeight)
      .attr('r', 0)
      .attr('fill', colors.dot)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1)')
      .transition()
      .delay((d, i) => i * 100 + 800)
      .duration(500)
      .attr('cy', d => y(d.hours))
      .attr('r', 6);

    const tooltip = g.append('g')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    tooltip.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', colors.tooltipBg);

    tooltip.append('text')
      .attr('class', 'tooltip-text')
      .attr('dy', '1.2em')
      .style('fill', colors.tooltipText)
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    g.selectAll('.dot')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('fill', colors.dotHover)
          .attr('r', 8);

        const [xPos, yPos] = [
          x(d.employee) + x.bandwidth() / 2,
          y(d.hours) - 15
        ];

        tooltip.attr('transform', `translate(${xPos},${yPos})`)
          .style('opacity', 1);

        const tooltipText = `${d.hours} hrs`;
        const text = tooltip.select('.tooltip-text')
          .text(tooltipText);
        text.style('fill', 'black')
          .style('font-size', '11px')
          .attr('y', -10)
          .attr('x', -15);

      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', colors.dot)
          .attr('r', 6);

        tooltip.style('opacity', 0);
      });

    // X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .style('color', colors.axis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '10px');

    // Y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .style('color', colors.axis)
      .selectAll('text')
      .style('font-size', '10px');

    // Y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .style('fill', colors.axis)
      .style('font-size', '12px')
      .text('Hours Worked');

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default LineChart;