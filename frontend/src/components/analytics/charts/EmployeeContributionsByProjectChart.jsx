import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const EmployeeContributionsByProjectChart = ({ data }) => {
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
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
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
    const maxValue = d3.max(sortedData, d => d.completed + d.overdue + d.due);
    const x = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth])
      .nice();

    // Add Y-axis and center the graph
    const yAxis = g.append('g')
      .call(d3.axisLeft(y));

    // Calculate the total height of the Y-axis labels
    const yAxisWidth = yAxis.node().getBBox().width;

    // Adjust the graph's horizontal position to center it
    const offsetX = (width - innerWidth - yAxisWidth - margin.right) / 2;
    g.attr('transform', `translate(${margin.left + offsetX},${margin.top})`);
    g.append('g')
      .call(d3.axisLeft(y));

    // Add X-axis with integer ticks
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x)
        .ticks(Math.min(maxValue, 10)) // Limit to 10 ticks max
        .tickFormat(d => Number.isInteger(d) ? d : '') // Only show integer labels
      )
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Tasks');

    // Create groups for each bar stack
    const barGroups = g.selectAll('.bar-group')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(0,${y(d.title)})`);

    // Create the stacked bars
    const bars = barGroups.selectAll('rect')
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
      .attr('fill', d => d.color)
      .on('mouseenter', function(event, d) {
        // Darken the bar color on hover
        d3.select(this).attr('fill', d3.color(d.color).darker(0.3));
        
        // Show the value text with full label
        const barGroup = d3.select(this.parentNode);
        barGroup.select(`.value-text-${d.type}`)
          .text(`${d.value} ${d.type}`)
          .style('opacity', 1);
      })
      .on('mouseleave', function(event, d) {
        // Restore original bar color
        d3.select(this).attr('fill', d.color);
        
        // Hide the value text
        const barGroup = d3.select(this.parentNode);
        barGroup.select(`.value-text-${d.type}`)
          .style('opacity', 0);
      });

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
        const prevValues = Array.from(nodes).slice(0, i).map(node => d3.select(node).datum().value);
        const startX = x(prevValues.reduce((sum, val) => sum + val, 0));
        return startX + x(d.value) / 2;
      })
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('opacity', 0);
      // Adjust the chart's vertical position by translating the main group
      g.attr('transform', `translate(${margin.left},${margin.top + 20})`);
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

export default EmployeeContributionsByProjectChart;