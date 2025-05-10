import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ProjectTaskAllocationBarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

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
      .call(d3.axisLeft(y).ticks(Math.ceil(y.domain()[1]))) // Ensure whole number ticks

    yAxis.transition()
      .duration(800)
      .attr('opacity', 1);

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Tasks')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Create bar groups
    const barGroups = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${x(d.label)},0)`);

    // Add not completed bars with animation
    barGroups.append('rect')
      .attr('class', 'bar-not-completed')
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#FF6384')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#E74C3C');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.label) + x.bandwidth() / 2)
          .attr('y', y(d.tasksAssigned - d.tasksCompleted) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.tasksAssigned - d.tasksCompleted} pending`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#FF6384');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr('y', d => y(d.tasksAssigned - d.tasksCompleted))
      .attr('height', d => innerHeight - y(d.tasksAssigned - d.tasksCompleted));

    // Add completed bars with animation (stacked on top of not completed)
    barGroups.append('rect')
      .attr('class', 'bar-completed')
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#4CAF50')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#2ECC71');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.label) + x.bandwidth() / 2)
          .attr('y', y(d.tasksCompleted) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.tasksCompleted} completed`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#4CAF50');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .delay((_, i) => i * 100 + 50)
      .duration(500)
      .attr('y', d => y(d.tasksCompleted))
      .attr('height', d => innerHeight - y(d.tasksCompleted));

    // Add legend with animation
    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - 100}, ${height - 15})`)
      .style('opacity', 0);

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

    legend.transition()
      .delay(data.length * 100 + 200)
      .duration(500)
      .style('opacity', 1);

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default ProjectTaskAllocationBarChart;