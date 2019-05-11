//################################################################################
// Applcation: Data Journalism and D3
// Author: Rod Skoglund
// File: App.js
// Description: Provides the D3.JS and Scalable Vector Graphics (SVG) to build an
//              D3 Animated Scatter Plot with multiple levels.
//################################################################################

// *******************************************************************************
// Define the dimensions, margins and padding for the graph/text areas.
// *******************************************************************************

var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = svgWidth - svgWidth / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBottom = 40;
var tPadLeft = 40;

// *******************************************************************************
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// *******************************************************************************
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// *******************************************************************************
// Function to set the radius of each dot in the graph. As a function, this can 
// be called to make setting it for different screen sizes.
// *******************************************************************************
var circleRadius;
function circleRadiusGet() {
  if (svgWidth <= 530) {
    circleRadius = 5;
  }
  else {
    circleRadius = 10;
  }
}
circleRadiusGet();

// *******************************************************************************
// Create group for 3 x-axis (bottom) labels
// *******************************************************************************

svg.append("g").attr("class", "xText");

// xText will allows the selection of the group.
var xText = d3.select(".xText");

// *******************************************************************************
// Function to give xText a transform property that puts it at the bottom of the 
// chart. As a function, it can be called to reset the location of the label group
// when the window changes.
// *******************************************************************************
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" + ((svgWidth - labelArea) / 2 + labelArea) + ", " + 
    (svgHeight - margin - tPadBottom) + ")"
  );
}
xTextRefresh();

// *******************************************************************************
// Use xText to append three text SVG files, with y coordinates specified to 
// space out the values.
// *******************************************************************************

// *******************************************************************************
// Poverty
// *******************************************************************************
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// *******************************************************************************
// Age
// *******************************************************************************
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

// *******************************************************************************
// Income
// *******************************************************************************
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// *******************************************************************************
// Use yText to append three text SVG files, with y coordinates specified to 
// space out the values.
// *******************************************************************************

// *******************************************************************************
// Create group for 3 y-axis (left) labels
// *******************************************************************************
svg.append("g").attr("class", "yText");

// yText will allows the selection of the group.
var yText = d3.select(".yText");

// Define variables to simplify the definition of the y group transform attr
var leftTextX = margin + tPadLeft;
var leftTextY = (svgHeight + labelArea) / 2 - labelArea;

// *******************************************************************************
// Function to give yText a transform property that puts it on the left of the 
// chart. As a function, it can be called to reset the location of the label group
// when the window changes.
// *******************************************************************************
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// *******************************************************************************
// Obesity
// *******************************************************************************
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// *******************************************************************************
// Smokes
// *******************************************************************************
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// *******************************************************************************
// Lacks Healthcare
// *******************************************************************************
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

//################################################################################
// Import the .csv file.
// This csv data file includes state-by-state demographic data from the US Census
// and measurements from health risks obtained by the Behavioral Risk Factor 
// Surveillance System.
//################################################################################

d3.csv("assets/data/data.csv").then(function(data) {
  // Display the current selected data
  displayCurrent(data);
});

// *******************************************************************************
// "displayCurrent" Function to handle the minupliation of all elements. It uses
// the data obtained from the dataset read in using the D3 .csv method.
// *******************************************************************************
function displayCurrent(theData) {
  // *****************************************************************************
  // Define Variables
  // *****************************************************************************
  
  // curX and curY will determine what data gets represented in each axis.
  // The defaults are defined here. They carry the same names as the headings in 
  // the .csv data file.
  var curX = "poverty";
  var curY = "obesity";

  // Empty variables to capture the min and max of the x and y data.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // *****************************************************************************
  // function to set up tooltip rules (see d3-tip.js).
  // *****************************************************************************
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      console.log(d);
      // x key
      var theX;
      // Grab the state name.
      var theState = "<div>" + d.state + "</div>";
      // Capture the y value's key and value, based on the current selection.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty, need to include the "%"
      if (curX === "poverty") {
        // Capture the x key and a version of the value formatted to show 
        // percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Capture the x key and a version of the value formatted to include 
        // commas after every third digit. This will work for both age (less than 
        // 4 digits, so no comma) and the household income, which will require 
        // the comma.
        theX = "<div>" +
          curX + ": " + parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display the captured data.
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);

  // *****************************************************************************
  // Function to get the min and max for the current selected x label and adjust 
  // it to to make it slightly smaller (min) and larger (max) so it can be used to 
  // define the mn and max values for the x axis.
  // *****************************************************************************
  function xMinMax() {
    // xMin will grab the smallest value from the selected column. Set the final 
    // value to 90% of the true min value.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // xMax will grab the largest value from the selected column. Set the final 
    // value to 110% of the true max value.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // *****************************************************************************
  // Function to get the min and max for the current selected y label and adjust 
  // it to to make it slightly smaller (min) and larger (max) so it can be used to 
  // define the mn and max values for the x axis.
  // *****************************************************************************
  function yMinMax() {
    // yMin will grab the smallest value from the selected column. Set the final 
    // value to 90% of the true min value.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // yMax will grab the largest value from the selected column. Set the final 
    // value to 110% of the true max value.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // *****************************************************************************
  // Function to change the classes and appearance of the lable text when it is 
  // clicked. It will make the current selection bolder then the other two and 
  // make the other two labels muted.
  // *****************************************************************************
  function labelChange(axis, clickedText) {
    // Switch the currently active label to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text for the just clicked label to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  //##############################################################################
  // Instantiate the Scatter Plot
  // Add the first placement of our data and axes to the scatter plot.
  //##############################################################################

  // Calculate the min and max values of x and y based on teh current label 
  // selections
  xMinMax();
  yMinMax();

  // Using the x and y min and max values, create the scales for the axes
  // In the range method, include the margin and label area for correct 
  // placement of the circles.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, svgWidth - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([svgHeight - margin - labelArea, margin]);

  // Pass the x and y scales into the appropriate D3 axis method to create 
  // the axes.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Function to set the x and y tick counts adjusted for SVG width for improved 
  // responsive behavior. 
  function tickCount() {
    if (svgWidth <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // Append the x and y axes to the svg, include all the numbers, borders and 
  // ticks. Use the transform attribute to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (svgHeight - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Create group for the dots and labels
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // Append the circles for each row (state) of data
  theCircles
    .append("circle")
    // Specify location, size and class attributes.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circleRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Define the Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Create labes for the circles on the graph. Put the state abbreviation on the 
  // circle, centered within the circle.
  theCircles
    .append("text")
    // Return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // place the text using the scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius, adding a third of the radius to 
      // the height pushes it into the middle of the circle.
      return yScale(d[curY]) + circleRadius / 2.5;
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    // Define the Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  //##############################################################################
  // Make the Graph Dynamic
  // This section will allow the user to click on any label and display the data 
  // it references.
  //##############################################################################

  // Select all axes text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Save a selection of the clicked text, so it can be reference later.
    var self = d3.select(this);

    // If the user selected the current label, ignore the selection, otherwise 
    // make the appropriate changes.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // We need change the location of the state texts.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make curY the same as the data name.
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion from it's original spot to the 
          // new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // Change the location of the state texts.
        d3.selectAll(".stateText").each(function() {
          // Give each state text the same motion as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circleRadius / 3;
            })
            .duration(300);
        });

        // Change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });

  //##############################################################################
  // Mobile Responsive
  // Using d3, call a resize function whenever the window dimensions change.
  //##############################################################################
  d3.select(window).on("resize", resize);

  // Specify what parts of the chart need size and position changes.
  function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on 
    // the width of the window).
    svgWidth = parseInt(d3.select("#scatter").style("width"));
    svgHeight = svgWidth - width / 3.9;
    leftTextY = (svgHeight + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas.
    svg.attr("width", svgWidth).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, svgWidth - margin]);
    yScale.range([svgHeight - margin - labelArea, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (svgHeight - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis.
    tickCount();

    // Update the labels.
    xTextRefresh();
    yTextRefresh();

    // Update the radius of each dot.
    circleRadiusGet();

    // With the axis changed, update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circleRadius;
      });

    // Change the location and size of the state texts.
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circleRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circleRadius / 3);
  }
}
