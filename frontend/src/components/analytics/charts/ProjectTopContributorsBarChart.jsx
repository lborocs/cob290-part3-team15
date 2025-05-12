import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ProjectTopContributorsBarChart = ({ data }) => {
  const ref = useRef();
  const width = 468;
  const height = 220;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    // Y-axis scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.hours) * 1.1])
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

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Hours Contributed')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .style('opacity', 1);

    // Add bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', innerHeight) // Start from bottom
      .attr('height', 0) // Start with 0 height
      .attr('fill', '#4CAF50')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#2ECC71');
        g.append('text')
          .attr('class', 'bar-tooltip')
          .attr('x', x(d.name) + x.bandwidth() / 2)
          .attr('y', y(d.hours) - 10)
          .attr('text-anchor', 'middle')
          .text(`${d.hours} hours`)
          .style('font-weight', 'bold')
          .style('font-size', '12px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#4CAF50');
        g.selectAll('.bar-tooltip').remove();
      })
      .transition()
      .delay((_, i) => i * 100) // Staggered delay
      .duration(500)
      .attr('y', d => y(d.hours))
      .attr('height', d => innerHeight - y(d.hours));
  
    // Add legend with animation
    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - 50}, ${height - 30})`)
      .style('opacity', 0);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#4CAF50');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text('Hours Worked')
      .style('font-size', '12px')
      .style('fill', '#333');

    legend.transition()
      .delay(data.length * 100 + 200)
      .duration(500)
      .style('opacity', 1);

  }, [data]);

  return <svg ref={ref} viewBox={`0 0 ${width} ${height}`} />;
};

export default ProjectTopContributorsBarChart;