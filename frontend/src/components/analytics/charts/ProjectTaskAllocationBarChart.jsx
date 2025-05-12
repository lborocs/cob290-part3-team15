import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ProjectTaskAllocationBarChart = ({ data }) => {
  const ref = useRef();
  const width = 468;
  const height = 220;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    // Y-axis scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.tasksAssigned) * 1.1])
      .range([innerHeight, 0])
      .nice();

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(Math.ceil(y.domain()[1])));

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Tasks');

    // Create bar groups
    const barGroups = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${x(d.label)},0)`);

    // Add completed bars with animation
    barGroups.append('rect')
      .attr('class', 'bar-completed')
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#4CAF50')
      .transition()
      .duration(800)
      .attr('y', d => y(d.tasksCompleted))
      .attr('height', d => innerHeight - y(d.tasksCompleted));

    // Add pending bars with animation (stacked on top of completed bars)
    barGroups.append('rect')
      .attr('class', 'bar-not-completed')
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#FF6384')
      .transition()
      .duration(800)
      .attr('y', d => y(d.tasksAssigned))
      .attr('height', d => innerHeight - y(d.tasksAssigned - d.tasksCompleted));

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - 100}, ${height - 15})`);

    legend.append('rect')
      .attr('x', 20)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#4CAF50');

    legend.append('text')
      .attr('x', 40)
      .attr('y', 10)
      .text('Completed')
      .style('font-size', '12px')
      .style('fill', '#333');

    legend.append('rect')
      .attr('x', 120)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#FF6384');

    legend.append('text')
      .attr('x', 140)
      .attr('y', 10)
      .text('Pending')
      .style('font-size', '12px')
      .style('fill', '#333');
  }, [data]);

  return <svg ref={ref} viewBox={`0 0 ${width} ${height}`} />;
};

export default ProjectTaskAllocationBarChart;
