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

//const calcOneDimnFromOther = (knownDimn, nrItems) => nrItems % knownDimn === 0 ? nrItems/knownDimn : Math.floor(nrItems/knownDimn) + 1;

const calcNrColsAndRows = (containerWidth, containerHeight, nrItems) => {
  const aspectRatio = containerHeight / containerWidth;
  if(aspectRatio <= 0.1){ return { nrRows: 1, nrCols : 24 } }
  if(aspectRatio <= 0.3){ return { nrRows: 2, nrCols : 12 } }
  if(aspectRatio <= 0.65){ return { nrRows: 3, nrCols : 8 } }
  if(aspectRatio <= 1){ return { nrRows: 4, nrCols : 6 } }
  if(aspectRatio <= 1.35){ return { nrRows: 6, nrCols : 4 } }
  if(aspectRatio <= 2){ return { nrRows: 8, nrCols : 3 } }
  if(aspectRatio <= 4){ return { nrRows: 12, nrCols : 2 } }
  if(aspectRatio > 4){ return { nrRows: 24, nrCols : 1 } }
}


//@TODO - consider using viewbox instead fro timeSeries as aspectRatio should be constant, but not for beeSwarms
const calculateChartSizesAndGridLayout = (container, nrItems, _containerMargin={}, _chartMargin={}) => {
  //dimns for overall container
  const containerWidth = container.getBoundingClientRect().width;
  const containerHeight = container.getBoundingClientRect().height;
  const defaultMargin = { left:0, right:0, top:0, bottom:0 };
  const containerMarginValues = typeof _containerMargin === "function" ? _containerMargin(containerWidth, containerHeight) : _containerMargin;
  const containerMargin = { ...defaultMargin, ...containerMarginValues };
  const contentsWidth = containerWidth - containerMargin.left - containerMargin.right;
  const contentsHeight = containerHeight - containerMargin.top - containerMargin.bottom;

  //nrRows and cols
  const { nrCols, nrRows } = calcNrColsAndRows(contentsWidth, contentsHeight, nrItems);
  //dimns for single chart
  const width = contentsWidth / nrCols;
  const height = contentsHeight / nrRows;
  const marginValues = typeof _chartMargin === "function" ? _chartMargin(width, height) : _chartMargin;
  const margin = { ...defaultMargin, ...marginValues }

  return { containerWidth, containerHeight, containerMargin, width, height, margin, nrRows, nrCols, nrCharts:nrItems }
}

const QuadrantsBarChart = ({ data={ chartsData:[] }, settings={} }) => {
  //local state
  const [chart, setChart] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [selectedQuadrantIndex, setSelectedQuadrantIndex] = useState(null);
  const [headerExtended, setHeaderExtended] = useState(false);

  const containerMargin = { left:10, right:10, top:10, bottom:10 };
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

  const containerRef = useRef(null);
  //render chart
  useEffect(() =>{
      if(!chart){
        //init
        setChart(() => quadrantsBarChart())
        const chartSizes = calculateChartSizesAndGridLayout(containerRef.current, data.chartsData.length, containerMargin, chartMargin);
        //@todo next - clacsizes func must accomodate more than 1 xhart into its space
        setSizes(chartSizes)
      }else{
        //data
        const processedChartsData = quadrantsBarChartLayout(data, { nrCols: sizes.nrCols });
        //settings
        chart
            .sizes(sizes)
            .selectedQuadrantIndex(selectedQuadrantIndex)
            .setSelectedQuadrantIndex(setSelectedQuadrantIndex)

        //call chart
        const visContentsG = d3.select(containerRef.current).select("svg").selectAll("g.vis-contents")
          .attr("transform", `translate(${sizes.containerMargin.left}, ${sizes.containerMargin.top})`);

        const chartG = visContentsG.selectAll("g.chart").data(processedChartsData);
        chartG.enter()
          .append("g")
            .attr("class", "chart")
            .merge(chartG)
            .attr("transform", (d,i) => `translate(${d.colNr * sizes.width},${d.rowNr * sizes.height})`)
            .call(chart)
      }
  }, [chart, sizes, data.chartsData.length, selectedQuadrantIndex, headerExtended])

  useEffect(() => {
    let resizeObserver = new ResizeObserver(() => { 
      const chartSizes = calculateChartSizesAndGridLayout(containerRef.current, data.chartsData.length, containerMargin, chartMargin);
      setSizes(chartSizes);
    }); 
    
    resizeObserver.observe(containerRef.current);
  }, [data.chartsData.length]);

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
      <div className={`viz-container ${headerExtended ? "with-extended-header" : ""}`} ref={containerRef}>
        <svg width="100%" height="100%">
          <g className="vis-contents"></g>
        </svg>
      </div>
    </div>
  )
}

export default QuadrantsBarChart;


