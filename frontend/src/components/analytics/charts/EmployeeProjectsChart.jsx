import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmployeeProjectsChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    // Ensure completed, overdue, and due are integers
    const sortedData = [...data].map(d => ({
      ...d,
      completed: parseInt(d.completed, 10),
      overdue: parseInt(d.overdue, 10),
      due: parseInt(d.due, 10),
    }));

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

    // (projects)
    const y = d3.scaleBand()
      .domain(sortedData.map((d, i) => d.title || `Project ${i + 1}`))
      .range([0, innerHeight])
      .padding(0.2);

    //(total task count)
    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.completed + d.overdue + d.due)])
      .range([0, innerWidth]);

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Tasks');

    // stacked bars
    g.selectAll('.bar-group')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(0,${y(d.title)})`)
      .selectAll('rect')
      .data(d => [
        { type: 'Completed', value: d.completed, color: '#4CAF50' },
        { type: 'Overdue', value: d.overdue, color: '#F44336' },
        { type: 'Due', value: d.due, color: '#FFC107' }
      ])
      .enter()
      .append('rect')
      .attr('x', (d, i, nodes) => {
        const prevValues = Array.from(nodes).slice(0, i).map(node => d3.select(node).datum().value);
        return x(prevValues.reduce((sum, val) => sum + val, 0));
      })
      .attr('y', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value))
      .attr('fill', d => d.color);

    // Add legend above the chart showing the colors and what they mean
    const legend = g.append('g')
      .attr('transform', `translate(0, -${margin.top})`);
    const legendData = [
      { type: 'Completed', color: '#4CAF50' },
      { type: 'Overdue', color: '#F44336' },
      { type: 'Due', color: '#FFC107' }
    ];
    const legendGroup = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`);

    legendGroup.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color);

    legendGroup.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(d => d.type)
      .style('font-size', '12px')
      .style('font-weight', 'bold');

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default EmployeeProjectsChart;