import React, { Component } from 'react';
import * as d3 from 'd3';

const transitionDuration = 400;
const r = 50;

function buildTilePath(x = 0, y = 0) {
  return d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveLinearClosed)([
      { x: r + x, y },
      { x, y: r + y },
      { x: x - r, y },
      { x, y: y - r }
    ]);
}
const tilePath = buildTilePath();

function buildTileData(cols = 64, rows = 64) {
  const tiles = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      tiles.push({
        col: i,
        row: j
      });
    }
  }
  return tiles;
}

function tileFill(d) {
  return d.active ? 'rgb(255, 1, 175)' : 'rgb(60, 60, 60)';
}

function toggleTile(target, tile) {
  const isNeighbor =
    (tile.col === target.col && tile.row === target.row) || // target
    (tile.row === target.row - 1 && (tile.col === target.col || tile.col === target.col + 1 || tile.col === target.col - 1)) || // above row
    (tile.row === target.row && (tile.col === target.col - 1 || tile.col === target.col + 1)) || // same row
    (tile.row === target.row + 1 && (tile.col === target.col || tile.col === target.col + 1 || tile.col === target.col - 1)); // below row
  if (isNeighbor) {
    return { ...tile, active: !tile.active };
  }

  return tile;
}

export default class Tiles extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      tileData: buildTileData()
    };
  }

  componentDidMount() {
    this.tileGroup = d3.select(this.svg).append('g');
    this.tileGroup.selectAll('.tile')
      .data(this.state.tileData)
      .enter()
      .append('svg:a')
        .attr('class', 'tile')
        .attr('href', '')
        .on('click', d => {
          console.log(d);
          d3.event.preventDefault();
          d3.event.stopPropagation();
          this.setState({
            tileData: this.state.tileData.map(tile => toggleTile(d, tile))
          });
        })
        .append('path')
          .attr('d', tilePath)
          .attr('fill', tileFill)
          .attr('stroke', 'transparent')
          .attr('stroke-width', 1)
          .attr('transform', d => {
            const cx = (d.col * r * 1.45) + r;
            const cy = (d.row * r * 1.45) + r;
            return `translate(${cx}, ${cy}) rotate(-45 00 0)`;
          })

          .call(d3.zoom()
            .scaleExtent([-3,3])
            .on("zoom", f => {
              this.tileGroup.attr("transform", d3.event.transform);
              console.log(d3.event.transform)
              }));
          // .attr('transform', 'rotate(90 0 0)');
          
    let svgBox = this.svg.getBoundingClientRect();
    console.log(svgBox);
/*
    svgBox.call(d3.zoom()

      .scaleExtent([1,8])
      .on("zoom", f => {
        this.tileGroup.attr("transform", d3.event.transform);
        console.log(d3.event.transform)
      })


    );*/


    let tileBox = this.tileGroup.node().getBBox();
    let scale = svgBox.height / tileBox.height;
    let centerX = (svgBox.width / 2) - ((tileBox.width * scale) / 2);
    
    this.tileGroup.attr('transform', `matrix(0, 0, 0, 0, ${centerX}, 0)`)
      .transition()
      .duration(transitionDuration)
        .attr('transform', `matrix(${scale}, 0, 0, ${scale}, ${centerX}, 0)`)
   

  }

/*function zoomed() {
  this.tileGroup.attr("transform", d3.event.transform);
  console.log(d3.event.transform)
}*/

  componentDidUpdate() {
    this.tileGroup
      .selectAll('.tile')
      .data(this.state.tileData)
      .select('path')
        .transition()
        .duration(transitionDuration)
        .attr('fill', tileFill);
  }

  render() {
    const tileStyle = { flex: 1 };
    return <svg ref={ svg => this.svg = svg } style={ tileStyle }/>;
  }
}