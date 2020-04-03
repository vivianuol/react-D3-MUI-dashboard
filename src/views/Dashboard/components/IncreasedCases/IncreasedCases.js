import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import * as d3 from 'd3';
import { json } from 'd3-fetch';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

var margin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
}

var canvas = {
  width: 640,
  height: 360
}

var width = 640 - margin.left - margin.right;
var height = 360 - margin.top - margin.bottom;


const IncreasedCases = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const incRef = useRef(null);

  const switchURL = () => {
    if ( props.state == '' ) {
      return json("https://covidtracking.com/api/us/daily")
    } else {
      return json(`https://covidtracking.com/api/states/daily?state=${props.state}`)
    }
  };


  useEffect(() => {

    d3.select(incRef.current).selectAll('svg').remove();

    switchURL().then((data) => {

    const svg = d3.select(incRef.current)
                        .append("svg")
                        .style('background', '#f4f4f4')
                        .attr("viewBox", "0 0 "+ canvas.width+ " "+ canvas.height )
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

    // the array is listed from last day to first day, we should reverse the order.
    const filtered = data.map(d=> { 
      return { 
                date: d.date,
                positive: d.positive,
                hospitalized: d.hospitalized,
              }
            });
      filtered.reverse();

    // array of all filtered data except Day 1  
    const ruleOutLast = filtered.slice(1,filtered.length)
    // array of all filtered data except Day last   
    const ruleOutFirst = filtered.slice(0, filtered.length-1);
  

    const wholeIncreased = ruleOutLast.map((d, i) => {
      return {
        date: d.date,
        positive: d.positive - ruleOutFirst[i].positive,
        hospitalized: d.hospitalized - ruleOutFirst[i].hospitalized
      }
    })
    console.log("the difference")
    console.log(wholeIncreased)
    
                      
      //list of subgroups
      
      var subGroups = ['positive', 'hospitalized'].reverse()


      //list of groups = value of the first colum called group
      var groups = d3.map(data, function (d) { return d.date }).keys();
      groups = groups.slice(0, groups.length-1).reverse()
      console.log("*****************")
      console.log(groups)

      var formattedDate = groups.map( date => date.slice(5,6) + "-" + date.slice(6,8));

      //Add X axis
      var xAxisScale = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

      var x_axis = d3.axisBottom()
        .tickSize(-3)
        .tickFormat((d, i) => formattedDate[i])
        .scale(xAxisScale)

      svg.append('g')
        .attr('transform', `translate(0, ${height} )`)
        .call(x_axis)
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)"); 


      //Add Y axis for values
      var maxHeight = Math.max.apply(Math, wholeIncreased.map(o => o.positive));

      var yAxisScale = d3.scaleLinear()
        .domain([maxHeight, 0])
        .range([0, height]);
      var y_axis = d3.axisLeft()
        .scale(yAxisScale);
      svg.append('g')
        .call(y_axis)
        
      
    
        //Add r axis for ratios

      var rAxisScale = d3.scaleLinear()
        .domain([100, 0])
        .range([0, height]);
      var r_axis = d3.axisRight()
        .scale(rAxisScale);
      svg.append('g')
        .call(r_axis)
        .attr('transform', `translate(${width}, 0 )`)


      //text label for x axis
      svg.append("text")
        .attr("transform",
          "translate(" + (width /2)+ " ," +
          (height + margin.top) + ")")
        .attr("dy", "0.6em")
        .style("text-anchor", "end")
        .text("Date");
        

      // text label for the y axis
      
      // the reason we put margin.left to y, and height/2 to x, is the original point rotate 90 degree from x, y -> (0, 0) to y, x ->(0, 0)
      //see: http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
      //above is for rotate(-90)

      svg.append("text")
        // .attr("transform", "rotate(-90)")
        .attr("x", 0 - margin.left)
        .attr("y", 0)
        .attr("dx", "5.5em")
        .attr("dy", "-0.5em")
        .style("text-anchor", "end")
        .style("font-size", "1em")
        .text("Cases");

      // text label for the r axis
      svg.append("text")
        .attr('transform', `translate(${width}, 0 )`)
        .attr("x", 0 - margin.left)
        .attr("y", 0)
        .attr("dx", "2.5em")
        .attr("dy", "-0.5em")
        .style("text-anchor", "end")
        .style("font-size", "1em")
        .text("%");

      //scale for subgroup positioning
      var xSubgroupScale = d3.scaleBand()
        .domain(subGroups)
        .range([xAxisScale.bandwidth(), 0])
        .padding([0.05])

      // color palette = one color per subgroup
      var color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#554562','#c4c4a6'])

        // Add one dot in the legend for each name.
        
        var catogery = ['positive', 'hospitalized']
        var size = 10
        svg.selectAll("mydots")
          .data(catogery)
          .enter()
          .append("rect")
            .attr("x", 100)
            .attr("y", function(d,i){ return 50 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
  
        // Add legend name for each dot.
        svg.selectAll("mylabels")
        .data(catogery)
        .enter()
        .append("text")
          .attr("x", 100 + size*1.2)
          .attr("y", function(d,i){ return 50 + i*(size+5) + (size/2)}) 
          // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
      
      //add title for the graph
      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("Hospitalized Increased Vs Test positive Increased Cases");

      //Show the bars
      svg.append('g')
        .selectAll('g')
        .data(wholeIncreased)
        .enter().append('g')
        .attr("transform", function (d) {
          return "translate(" + xAxisScale(d.date) + ",0)";
         })
        .selectAll('rect')
        .data(function (d) {
          return subGroups.map(function (key) {
            let cleanData;
            if (d[key] == '') {
              d[key] = 0;
            }
            cleanData = {
              key: key,
              value: parseInt(d[key])
            }
            // console.log("d-key")
            // console.log(parseInt(d[key]));

            return cleanData;
          });
        })
        .enter().append('rect')
        .attr("x", function (d) { return xSubgroupScale(d.key); })
        .attr("y", function (d) { return yAxisScale(d.value); })
        .attr('width', xSubgroupScale.bandwidth())
        .attr('height', d => (height - yAxisScale(d.value)))
        .style('fill', (d, i) => color(i))
    
    //  //show the connected scatters for ratio
    // // Add the line
    // svg.append("path")
    //   .datum(wholeIncreased)
    //   .attr("fill", "none")
    //   .attr("stroke", "#f26b5b")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(function(d) { return xAxisScale(d.date) })
    //     .y(function(d) { return rAxisScale(d.ratio) })
    //     )
    //  // Add the points
    //  svg
    //  .append("g")
    //  .selectAll("dot")
    //  .data(wholeIncreased)
    //  .enter()
    //  .append("circle")
    //    .attr("cx", function(d) { return xAxisScale(d.date) } )
    //    .attr("cy", function(d) { return rAxisScale(d.ratio) } )
    //    .attr("r", 3)
    //    .attr("fill", "#f26b5b")
    
      })
  },[props.state])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button
            size="small"
            variant="text"
          >
            Last 7 days <ArrowDropDownIcon />
          </Button>
        }
        title="Increased Cases"
      />
      <Divider />
      <CardContent>
        <div
          ref={incRef}
        >
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

IncreasedCases.propTypes = {
  className: PropTypes.string
};

export default IncreasedCases;
