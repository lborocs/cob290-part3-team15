import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = ref.current.parentElement.offsetWidth;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height + 50); // Add extra space for the legend

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Spin animation on mount
    g.transition()
      .duration(1000)
      .attrTween("transform", () => {
        const rotateInterpolate = d3.interpolate(0, 360);
        return t => `translate(${width / 2}, ${height / 2}) rotate(${rotateInterpolate(t)})`;
      });

    const color = d3.scaleOrdinal(['#4CAF50', '#FF6384']);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    const pieData = pie(data);
    const total = d3.sum(data, d => d.value);

    const slice = g.selectAll('.slice')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'slice');

    slice.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .each(function(d) { this._current = d; })
     /* .on('mouseenter', function (_, d) {
        d3.select(this.parentNode).select('text.percentage')
          .transition()
          .duration(200)
          .style('opacity', 1);
        d3.select(this.parentNode).select('text.label')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', function () {
        d3.select(this.parentNode).select('text.percentage')
          .transition()
          .duration(200)
          .style('opacity', 0);
        d3.select(this.parentNode).select('text.label')
          .transition()
          .duration(200)
          .style('opacity', 0);
      })
    */
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return t => arc(interpolate(t));
      });

    // Label text
    slice.append('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '1.2em') 
      .attr('text-anchor', 'middle')
      .text(d => d.data.label)
      .style('fill', '#333')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('opacity', 0);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(10, ${height + 10})`);

    legend.selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 20})`)
      .each(function(d) {
        const legendItem = d3.select(this);

        legendItem.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', color(d.label));

        legendItem.append('text')
          .attr('x', 18)
          .attr('y', 10)
          .text(d.label)
          .style('font-size', '12px')
          .style('fill', '#333');
      });

  }, [data]);

  return <svg ref={ref} className="w-full" />;
};

export default PieChart;