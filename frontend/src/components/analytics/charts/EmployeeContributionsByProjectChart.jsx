import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const EmployeeContributionsByProjectChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Parse data values to integers
    const processedData = [...data].map(d => ({
      ...d,
      completed: parseInt(d.completed, 10),
      overdue: parseInt(d.overdue, 10),
      due: parseInt(d.due, 10),
      title: d.title || `Project ${data.indexOf(d) + 1}`
    }));

    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const margin = { top: 50, right: 20, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Y-axis scale (projects)
    const y = d3.scaleBand()
      .domain(processedData.map(d => d.title))
      .range([0, innerHeight])
      .padding(0.2);

    // X-axis scale (total task count)
    const maxValue = d3.max(processedData, d => d.completed + d.overdue + d.due) * 1.1;
    const x = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth])
      .nice();

    // Add Y-axis with animation
    const yAxis = g.append('g')
      .attr('opacity', 0)
      .call(d3.axisLeft(y));
    
    yAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add X-axis with animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('opacity', 0)
      .call(d3.axisBottom(x)
        .ticks(Math.min(maxValue, 10))
        .tickFormat(d => Number.isInteger(d) ? d : '')
      );
    
    xAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add axis labels
    g.append('text')
      .attr('x', innerWidth / 2 - 30)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .text('Tasks')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Create groups for each bar stack
    const barGroups = g.selectAll('.bar-group')
      .data(processedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(0,${y(d.title)})`);

    // Add bars with animation
    barGroups.selectAll('rect')
      .data(d => [
        { type: 'Completed', value: d.completed, color: '#4CAF50' },
        { type: 'Overdue', value: d.overdue, color: '#F44336' },
        { type: 'Due', value: d.due, color: '#FFC107' }
      ])
      .enter()
      .append('rect')
      .attr('x', (d, i, nodes) => {
        const prevValues = nodes.slice(0, i).map(node => d3.select(node).datum().value);
        return x(prevValues.reduce((sum, val) => sum + val, 0));
      })
      .attr('y', 0) 
      .attr('height', y.bandwidth()) 
      .attr('width', 0) 
      .attr('fill', d => d.color)
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('fill', d3.color(d.color).darker(0.3));
        const barGroup = d3.select(this.parentNode);
        barGroup.select(`.value-text-${d.type}`)
          .text(`${d.value} ${d.type}`)
          .style('opacity', 1);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('fill', d.color);
        const barGroup = d3.select(this.parentNode);
        barGroup.select(`.value-text-${d.type}`)
          .style('opacity', 0);
      })
      .transition()
      .delay((_, i) => i * 100) // Staggered delay
      .duration(500)
      .attr('width', d => x(d.value) - x(0));

    // Add value text for each segment (hidden by default)
    barGroups.selectAll('.value-text')
      .data(d => [
        { type: 'Completed', value: d.completed, color: '#4CAF50' },
        { type: 'Overdue', value: d.overdue, color: '#F44336' },
        { type: 'Due', value: d.due, color: '#FFC107' }
      ])
      .enter()
      .append('text')
      .attr('class', d => `value-text value-text-${d.type}`)
      .attr('x', (d, i, nodes) => {
        const prevValues = nodes.slice(0, i).map(node => d3.select(node).datum().value);
        const startX = x(prevValues.reduce((sum, val) => sum + val, 0));
        return startX + (x(d.value) - x(0)) / 2;
      })
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d.value);

    // Add legend with animation
    const legendData = [
      { type: 'Completed', color: '#4CAF50' },
      { type: 'Overdue', color: '#F44336' },
      { type: 'Due', color: '#FFC107' }
    ];

    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - 150}, 20)`)
      .style('opacity', 0);

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * 120}, 0)`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(d => d.type)
      .style('font-size', '12px');

    legend.transition()
      .delay(processedData.length * 100 + 200)
      .duration(500)
      .style('opacity', 1);

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default EmployeeContributionsByProjectChart;