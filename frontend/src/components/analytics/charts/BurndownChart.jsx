import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const BurndownChart = ({ data }) => {
  const ref = useRef();
  const width = 468;
  const height = 220;

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract the data and the graph type
    const type = data.type;
    let content = data.content;

    const today = new Date();
    // Extract the deadline if data is for a project
    const projectDeadline = data.type === 'project' ? new Date(data.deadline) : null;

    const margin = { top: 20, right: 20, bottom: 40, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(ref.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extend the x-axis range to include dates beyond the last data point
    const firstDate = new Date(content[0].date);
    const lastDate = new Date(content[content.length - 1].date);
    const maxLastDate = lastDate > projectDeadline ? lastDate : projectDeadline;
    const extendedLastDate = d3.timeWeek.offset(maxLastDate, 2); // Extend by 2 weeks

    // Add a placeholder point for the horizontal continuation of the actual line
    let actualLineData = [...content];
    const lastValue = content[content.length - 1].actual;

    // Add horizontal continuation only if there is at least one data point and the final data point is not zero
    if (content.length > 0 && lastValue != 0) {
      actualLineData = [...content, { date: today.toISOString(), actual: lastValue }]; // Continue horizontally to today's date
    }

    const x = d3.scaleTime()
      .domain([firstDate, extendedLastDate])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(content, d => +d.actual) * 1.1 + 1])
      .range([innerHeight, 0])
      .nice();

    // Add X-axis with animation
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('opacity', 0)
      .call(
        d3.axisBottom(x)
          .ticks(8) // Try for 8 ticks to avoid overlapping
          .tickFormat(d3.timeFormat("%d %b"))
      );

    xAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add X-axis label
    svg.append('text')
      .attr('x', innerWidth / 2 - 15)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .text('Date')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Add Y-axis with animation
    const yAxis = svg.append('g')
      .attr('opacity', 0)
      .call(
        d3.axisLeft(y)
          .ticks(5));

    yAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Hours Remaining')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Add ideal line and deadline marker if project selected (diagonal from top-left to bottom-right)
    if (type === 'project') {
      const deadline = x(projectDeadline);
      const yTop = d3.max(content, d => +d.actual);

      svg.append('line')
        .attr('x1', 0)
        .attr('y1', yTop > 0 ? y(yTop) : y(0.8))
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', '#4CAF50')
        .attr('stroke-width', 2)
        .transition()
        .duration(1000)
        .attr('x2', deadline)
        .attr('y2', innerHeight);

      svg.append('path')
        .attr('transform', `translate(${deadline}, ${innerHeight})`)
        .attr('d', d3.symbol()
          .type(d3.symbolDiamond)
        )
        .style('opacity', 0)
        .transition()
        .delay(800)
        .style('opacity', 1);
    }

    // Create line generator for the actual line
    const actualLine = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.actual));

    // Add the actual line with animation
    const path = svg.append('path')
      .datum(actualLineData) // Use filtered data with horizontal continuation
      .attr('fill', 'none')
      .attr('stroke', '#FF6384')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', function() { return this.getTotalLength() })
      .attr('stroke-dashoffset', function() { return this.getTotalLength() })
      .attr('d', actualLine);

    path.transition()
      .delay(500)
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    // Add dots for actual data points with animation
    const dots = svg.selectAll('.dot-actual')
      .data(content)
      .enter()
      .append('circle')
      .attr('class', 'dot-actual')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', innerHeight) // Start from bottom
      .attr('r', 0) // Start with radius 0
      .attr('fill', '#FF6384')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#E53935');

        // Format date for display
        const dateStr = d3.timeFormat("%d %b")(new Date(d.date));

        // Add tooltip
        svg.append('text')
          .attr('class', 'dot-tooltip')
          .attr('x', x(new Date(d.date)))
          .attr('y', y(d.actual) - 10)
          .attr('text-anchor', 'middle')
          .text(`${dateStr}`)
          .style('font-weight', 'bold')
          .style('font-size', '11px')
          .style('fill', '#E53935');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#FF6384');
        svg.selectAll('.dot-tooltip').remove();
      });

    dots.transition()
      .delay((_, i) => 500 + i * 200) // Staggered delay
      .duration(500)
      .attr('cy', d => y(d.actual))
      .attr('r', 5);

    // Add today's date vertical dashed line with animation
    if (today >= firstDate && today <= extendedLastDate) {
      const todayX = x(today);

      const todayLine = svg.append('line')
        .attr('x1', todayX)
        .attr('y1', 0)
        .attr('x2', todayX)
        .attr('y2', 0)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

      todayLine.transition()
        .delay(1500)
        .duration(500)
        .attr('y2', innerHeight);

      // Add label for today's date
      svg.append('text')
        .attr('x', todayX + 5)
        .attr('y', +12)
        .attr('fill', '#000')
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text("Today")
        .style('opacity', 0)
        .transition()
        .delay(1500)
        .style('opacity', 1);
    }

    // Add legend with animation
    const legend = svg.append('g')
        .attr('transform', `translate(${innerWidth - 100}, 20)`)
        .style('opacity', 0);

    legend.transition()
        .delay(2000)
        .duration(500)
        .style('opacity', 1);

    legend.append('line')
        .attr('x1', 55)
        .attr('y1', 20)
        .attr('x2', 70)
        .attr('y2', 20)
        .attr('stroke', '#FF6384')
        .attr('stroke-width', 2);

    legend.append('text')
        .attr('x', 80)
        .attr('y', 20)
        .attr('dy', '.35em')
        .text('Actual')
        .style('font-size', '12px');

    // Add ideal line and deadline marker if project selected
    if (type === 'project') {

      legend.append('line')
          .attr('x1', 55)
          .attr('y1', 0)
          .attr('x2', 70)
          .attr('y2', 0)
          .attr('stroke', '#4CAF50')
          .attr('stroke-width', 2);

      legend.append('text')
          .attr('x', 80)
          .attr('y', 0)
          .attr('dy', '.35em')
          .text('Ideal')
          .style('font-size', '12px');

      legend.append('path')
          .attr('transform', `translate(62.5, 40)`)
          .attr('d', d3.symbol()
              .type(d3.symbolDiamond)
          );

      legend.append('text')
          .attr('x', 80)
          .attr('y', 40)
          .attr('dy', '.35em')
          .text('Due')
          .style('font-size', '12px');
    }

  }, [data]);

  return <svg ref={ref} viewBox={`0 0 ${width} ${height}`} />;
};

export default BurndownChart;