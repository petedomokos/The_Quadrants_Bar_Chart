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

  const calcNrCols = (containerWidth/*, minChartWidth = 80*/) => {
    if(containerWidth >= 800){ return 8; }
    if(containerWidth >= 600) { return 6; }
    if(containerWidth >= 400) { return 4; }
    if(containerWidth >= 300) { return 2; }
    return 1;  
  }
  //@TODO - consider using viewbox instead fro timeSeries as AR should be constant, but not for beeSwarms
  const calculateChartSizesAndGridLayout = (container, nrItems, containerMargin={}, chartMargin={}) => {
    //console.log("nrRows cols", nrRows, nrCols)
    //dimns for overall container
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;
    console.log("w h", containerWidth, containerHeight)
    const contentsWidth = containerWidth - (containerMargin.left || 0) - (containerMargin.right || 0);
    const contentsHeight = containerHeight - (containerMargin.top || 0) - (containerMargin.bottom || 0);

    //nrRows and cols
    const nrCols = calcNrCols(containerWidth);
    const nrRows = nrItems % nrCols === 0 ? nrItems/nrCols : Math.floor(nrItems/nrCols) + 1;

    //dimns for single chart
    const width = contentsWidth / nrCols;
    const height = contentsHeight / nrRows
    const marginValues = typeof chartMargin === "function" ? chartMargin(width, height) : chartMargin;
    const margin = { left:0, right:0, top:0, bottom:0, ...marginValues }

    return { width, height, margin, nrRows, nrCols, nrCharts:nrItems }
  }

const QuadrantsBarChart = ({ data={ chartsData:[] }, settings={} }) => {
  //console.log("Data", data)
  //local state
  const [chart, setChart] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [selectedQuadrantIndex, setSelectedQuadrantIndex] = useState(null);
  const [headerExtended, setHeaderExtended] = useState(false);
  console.log("ext?", headerExtended)

  const containerMargin = { left:20, right:20, top:20, bottom:20 };
  const chartMargin = (width, height) => ({ left:width * 0.1, right:width * 0.1, top:height * 0.1, bottom:height * 0.1 });
  /*const titleHeight = 50;
  const styleProps = { containerMargin, titleHeight };
  const classes = useStyles(styleProps);
  const classes = {
    root:"", title:"", container:""
  }*/

  const toggleHeaderExtended = e => {
    setHeaderExtended(prevState => !prevState);
  }

  const chartsRef = useRef(null);
  //render chart
  useEffect(() =>{
      if(!chart){
        //init
        setChart(() => quadrantsBarChart())
        const chartSizes = calculateChartSizesAndGridLayout(chartsRef.current, data.chartsData.length, containerMargin, chartMargin);
        //@todo next - clacsizes func must accomodate more than 1 xhart into its space
        setSizes(chartSizes)
      }else{
        //data
        const processedChartsData = quadrantsBarChartLayout(data, { nrCols: sizes.nrCols });
        //console.log("processedData", processedChartsData)
        //settings
        chart
            .sizes(sizes)
            .selectedQuadrantIndex(selectedQuadrantIndex)
            .setSelectedQuadrantIndex(setSelectedQuadrantIndex)

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
    <div className="viz-root">
      <div className={`viz-header ${headerExtended ? "extended" : ""}`}>
        <div className="title-and-description">
          <div className="viz-title">
            {data.title?.map((line, i) => 
              <div className="title-line" key={`title-line-${i}`}>{line}</div> )
            }
          </div>
          <a 
            className={`desc-btn ${headerExtended ? "to-hide" : "to-show"}`}
            onClick={toggleHeaderExtended}
          >
            {`${headerExtended ? "Hide" : "Show"} Description`}
          </a>
          <div className={`viz-desc ${headerExtended ? "extended" : ""}`}>
            {data.desc?.map((line, i) => 
              <div className="desc-line" key={`desc-line-${i}`}>{line}</div> )
            }
          </div>
        </div>
        <div>
          <div className="player-name">
            <div className="label">player</div>
            <div className="name">{data.playerName}</div>
          </div>
        </div>
      </div>
      <svg ref={chartsRef} className="viz-container">
      </svg>
    </div>
  )
}

export default QuadrantsBarChart;


