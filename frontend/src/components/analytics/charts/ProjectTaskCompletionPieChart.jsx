import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ProjectTaskCompletionPieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = ref.current.parentElement.offsetWidth;
    const height = 220;
    const radius = Math.min(width, height) / 3; 
    const margin = { top: 20, right: 20, bottom: 60, left: 20 }; 

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 - 20})`);

    const color = d3.scaleOrdinal(['#4CAF50', '#FF6384']);
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);
    
    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);
    
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const total = d3.sum(data, d => d.value);

    // Initial empty pie
    const emptyPie = pie(data.map(d => ({ ...d, value: 0 })));

    // Animate from empty pie to actual data
    const slice = g.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    slice.append('path')
      .attr('d', arc(emptyPie[0])) // Start from empty
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)')
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)')
          .style('opacity', 0.8);
      })
      .transition()
      .delay((d, i) => i * 200)
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(emptyPie[0], d);
        return t => arc(interpolate(t));
      });

    // Add polylines connecting labels to slices
    slice.append('polyline')
      .attr('stroke', '#333')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', function(d) {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 0.6);

    // Add percentage labels
    slice.append('text')
      .attr('class', 'percentage')
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', function(d) {
        return midAngle(d) < Math.PI ? 'start' : 'end';
      })
      .text(d => `${Math.round(d.data.value / total * 100)}%`)
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);

    // Helper function for label positioning
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Add legend with animation
    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - 100}, ${height - 30})`)
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
      .text('Completed')
      .style('font-size', '12px')
      .style('fill', '#333');

    legend.append('rect')
      .attr('x', 100)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#FF6384');

    legend.append('text')
      .attr('x', 120)
      .attr('y', 12)
      .text('Not Completed')
      .style('font-size', '12px')
      .style('fill', '#333');

    legend.transition()
      .delay(1500)
      .duration(500)
      .style('opacity', 1);

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default ProjectTaskCompletionPieChart;