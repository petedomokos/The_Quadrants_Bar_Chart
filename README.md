 # The Quadrants Bar Chart

## Overview

Take 4 bar charts, turn two of them upside down and stick them together. What do you get? The Quadrants Bar Chart.
This a fantastic way to make progress towards an ideal state - simply normalise all bar values so they are out of the same amount (eg 100%).
Then the goal is to fill each bar fully, making a perfect square!

It is particularly good for data that naturally falls into 2 or 4 categories, because each half or quadrant represents a category.

## About this project

This is an ongoing little project to show case the potential that D3 offers, by manipulating a simple bar chart in an unusual way.

Clone and run the code to see an example of a sports rehabilitation tracker for injured players.

## How the chart works

#### Bar ordering

The highest bars, representing the measures that going the best, are always towards the centre of the overall square. This make it easier to see the shape of the overall progress, at the expense of the ability to track progress for a particular bar. User will soon be able to remove auto-ordering when they want to track several specific bars more than the overall progress.

In our sports rehabilitation example, whereas an executive (or manager) may want to just know the overall shape for all injured players, a coach or physio would be more interested in the specific bars.

#### Drilling Down

User can select a quadrant, and it will enlarge. It is not yet possible to see info on bars or to drill down into bars.

## Technical Implementation

As is standard, the data (currently mock) runs through a [D3 layout function](https://github.com/petedomokos/The_Quadrants_Bar_Chart/blob/master/src/quadrantsBarChart/quadrantsBarChartLayout.js) to prepare it for our D3 component. Note that the layout function 
is not yet implemented in the standard way using an inner function to allow chaining of settings, as there are not yet sufficient settings to justify this, although this will change as more functionality is added.

D3 runs on an svg element that is rendered within a [React component](https://github.com/petedomokos/The_Quadrants_Bar_Chart/blob/master/src/quadrantsBarChart/QuadrantsBarChart.js).

The [D3 component](https://github.com/petedomokos/The_Quadrants_Bar_Chart/blob/master/src/quadrantsBarChart/quadrantsBarChartComponent.js) uses inner functions rather than classes, because this is more consistent with the implementation of D3 itself, allowing
for seamless integration of these functions within standard D3 chaining.



## More functionality coming soon

   - Hover or tap the bars for an info popup/tooltip

   - Click/tap a session for more detail

   - Run an animation to see progress unfold alongside other info or videos (eg as part of a larger dashboard)

   - Remove auto-ordering of bars to make tracking particular bars easier ( but tracking the overall shape becomes harder)
     
   - Colour variations for each bar in each quadrant to aid individual tracking without having to lose the auto-ordering




