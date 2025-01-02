import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3';
import { quadrantsBarChartLayout } from './quadrantsBarChartLayout';
import quadrantsBarChart from "./quadrantsBarChartComponent";
import { isNumber } from '../helpers/dataHelpers';
//children
//helpers

/*const useStyles = makeStyles((theme) => ({
  title:{
    fontSize:"20px",
    width:"100%",
    height:props => `${props.titleHeight}px`,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    //border:"solid",
  },
  container:{
    width:"100%",
    height:props => `calc(100% - ${props.titleHeight}px)`,
    transform:props => `translate(${props.containerMargin.left}px, ${props.containerMargin.top}px)`
  },
}))*/

  //@TODO - consider using viewbox instead fro timeSeries as AR should be constant, but not for beeSwarms
  const calculateChartSizes = (container, nrRows, nrCols, containerMargin={}, chartMargin={}) => {
    //console.log("nrRows cols", nrRows, nrCols)
    //dimns for overall container
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;
    //console.log("w, h.........", width, height)
    const contentsWidth = containerWidth - (containerMargin.left || 0) - (containerMargin.right || 0);
    const contentsHeight = containerHeight - (containerMargin.top || 0) - (containerMargin.bottom || 0);
    //dimns for single chart
    const width = contentsWidth / nrCols;
    const height = contentsHeight / nrRows
    const marginValues = typeof chartMargin === "function" ? chartMargin(width, height) : chartMargin;
    const margin = { left:0, right:0, top:0, bottom:0, ...marginValues }

    return { width, height, margin }
  }

const calcNrRowsAndCols = (nrRows, nrCols, nrItems, direction="portrait") => {
  //console.log("calcRowsCols items...", nrItems)
  //case A - only 1 item
  if(nrItems < 2) { return { rows: 1, cols: 1 } }
  //case B - auto set to make it as square as possible
  if(!nrRows && !nrCols){
    //@todo :pick the pair of factors that are closest to each other
    //eg if 10, then 5 x 2
    //note also, if dir is portrait, then its 2 cols, if its landscape, its 5 cols
    //temp  - default to 1 row
    return { rows: 1, cols:nrItems }
  }
  //case C - user sets custom nrRows
  if(isNumber(nrRows)) { 
    return { rows:nrRows, cols: nrItems % nrRows === 0 ? nrItems/nrRows : Math.floor(nrItems/nrRows) + 1 }
  }
  //case D - user sets custom nrCols and doesnt set rows
  if(!isNumber(nrRows) && isNumber(nrCols)) {
    return { cols:nrCols, rows: nrItems % nrCols === 0 ? nrItems/nrCols : Math.floor(nrItems/nrCols) + 1 }
  }
}

const QuadrantsBarChart = ({ data={ chartsData:[] }, settings={} }) => {
  console.log("Data", data)
  //local state
  const [chart, setChart] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [selectedQuadrantIndex, setSelectedQuadrantIndex] = useState(null);
  const nrRowsAndCols = calcNrRowsAndCols(settings.nrRows, settings.nrCols, data.chartsData.length);
  const [nrRows, setNrRows] = useState(nrRowsAndCols.rows);
  const [nrCols, setNrCols] = useState(nrRowsAndCols.cols);

  const containerMargin = { left:20, right:20, top:20, bottom:20 };
  const chartMargin = (width, height) => ({ left:width * 0.1, right:width * 0.1, top:height * 0.1, bottom:height * 0.1 });
  /*const titleHeight = 50;
  const styleProps = { containerMargin, titleHeight };
  const classes = useStyles(styleProps);
  const classes = {
    root:"", title:"", container:""
  }*/

  const chartsRef = useRef(null);
  //render chart
  useEffect(() =>{
      if(!chart){
        //init
        setChart(() => quadrantsBarChart())
        const chartSizes = calculateChartSizes(chartsRef.current, nrRows, nrCols, containerMargin, chartMargin);
        //@todo next - clacsizes func must accomodate more than 1 xhart into its space
        setSizes(chartSizes)
      }else{
        //console.log("rows cols",nrRows, nrCols)
        //data
        const processedChartsData = quadrantsBarChartLayout(data, { nrCols });
        //console.log("processedData", processedChartsData)
        //settings
        chart
            .sizes(sizes)
            .selectedQuadrantIndex(selectedQuadrantIndex)
            .setSelectedQuadrantIndex(setSelectedQuadrantIndex)
            //.nrRows(nrRows)
            //.nrCols(nrCols)
        

        //call chart
        const chartG = d3.select(chartsRef.current).selectAll("g.chart").data(processedChartsData);
        chartG.enter()
          .append("g")
            .attr("class", "chart")
            .merge(chartG)
            .attr("transform", (d,i) => `translate(${d.colNr * sizes.width},${d.rowNr * sizes.height})`)
            .call(chart)
      }
  })

  return (
    <div className="quadrants-chart-root">
      {/**<Typography variant="h6" className="quadrants-chart-title">
          Quadrant Bar Chart
        </Typography>*/}
      <div className="quadrants-chart-header">
        <div>
          <div className="quadrants-chart-title">{data.title || ""}</div>
          <div className="quadrants-chart-desc">
            {data.desc?.map((line, i) => 
              <div key={`line-${i}`}>{line}</div> )}
          </div>
        </div>
        <div>
          <div className="player-name">
            <div className="label">player:</div>
            <div className="name">{data.playerName}</div>
          </div>
        </div>
      </div>
      <svg ref={chartsRef} className="quadrants-chart-container">
      </svg>
    </div>
  )
}

export default QuadrantsBarChart;


