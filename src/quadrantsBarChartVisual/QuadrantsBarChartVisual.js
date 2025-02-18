import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3';
import { quadrantsBarChartLayout } from './quadrantsBarChartLayout';
import quadrantsBarChart from "./quadrantsBarChartComponent";
import { remove, fadeIn } from '../helpers/domHelpers';

const CONTAINER_MARGIN = { left:10, right:10, top:10, bottom:40 };

const calcNrColsAndRows = (containerWidth, containerHeight, n) => {
  //aspect ratio, a
  const a = containerWidth / containerHeight;
  const proportionOfNForWidth = Math.sqrt(n * a);
  const nrCols = Math.round(proportionOfNForWidth);
  //always round up the rows so there is enough cells
  const nrRows = Math.ceil(n/nrCols);
  //@todo - consider adjusting cols if ther is an orphan on last row ie 
  //const nrOnLastRow = n - (nrRows-1) * nrCols;
  return { nrCols, nrRows }
}

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

const QuadrantsBarChartVisual = ({ data={ datapoints:[] } }) => {
  //local state
  const [chart, setChart] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [selectedQuadrantIndex, setSelectedQuadrantIndex] = useState(null);
  const [headerExtended, setHeaderExtended] = useState(false);

  const chartMargin = (width, height) => ({ left:width * 0.1, right:width * 0.1, top:height * 0.1, bottom:height * 0.1 });

  const toggleHeaderExtended = e => {
    setHeaderExtended(prevState => !prevState);
  }

  const containerRef = useRef(null);
  const zoomGRef = useRef(null);
  
  //chart
  useEffect(() => {
    setChart(() => quadrantsBarChart());
  },[])
  //sizes
  useEffect(() => {
    const chartSizes = calculateChartSizesAndGridLayout(containerRef.current, data.datapoints.length, CONTAINER_MARGIN, chartMargin);
    setSizes(chartSizes)
  },[data.datapoints.length])

  //render chart
  useEffect(() => {
    if(!sizes){ return; }
    //data
    const processedDatapoints = quadrantsBarChartLayout(data, { nrCols: sizes.nrCols });
    //settings
    chart
        .sizes(sizes)
        .selectedQuadrantIndex(selectedQuadrantIndex)
        .setSelectedQuadrantIndex(setSelectedQuadrantIndex)

    //zoom
    const handleZoom = e => {
      d3.select(zoomGRef.current).attr("transform", e.transform)
    }
    const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [sizes.containerWidth, sizes.containerHeight]])
      .on("zoom", handleZoom)

    const svg = d3.select(containerRef.current).call(zoom)

    //call chart
    const visContentsG = svg.select("svg").selectAll("g.vis-contents")
      .attr("transform", `translate(${sizes.containerMargin.left}, ${sizes.containerMargin.top})`)

    const chartG = visContentsG.selectAll("g.chart").data(processedDatapoints, d => d.key);
    chartG.enter()
      .append("g")
        .attr("class", "chart")
        .call(fadeIn, { transition:{ duration: 500, delay:500 }})
        .merge(chartG)
        .attr("transform", (d,i) => `translate(${d.colNr * sizes.width},${d.rowNr * sizes.height})`)
        .call(chart)

    chartG.exit().call(remove)
  //@todo - this ueff has a dependency on data, so really it should be in array below,
  //but its not because we dont want datapoints.length to trigger an update as it will be 
  //triggered after sizes has changed, not before. 
  }, [chart, sizes, selectedQuadrantIndex, headerExtended, data.key])
  

  useEffect(() => {
    let resizeObserver = new ResizeObserver(() => { 
      const chartSizes = calculateChartSizesAndGridLayout(containerRef.current, data.datapoints.length, CONTAINER_MARGIN, chartMargin);
      setSizes(chartSizes);
    }); 
    
    resizeObserver.observe(containerRef.current);
  }, [data.datapoints.length]);

  return (
    <div className="viz-root">
      <div className={`viz-header ${headerExtended ? "extended" : ""}`}>
        <div className="title-and-description">
          <div className="viz-title">
            {data.title?.map((line, i) => 
              <div className="title-line" key={`title-line-${i}`}>{line}</div> )
            }
          </div>
          <div
            className={`desc-btn ${headerExtended ? "to-hide" : "to-show"}`}
            onClick={toggleHeaderExtended}
          >
            {`${headerExtended ? "Hide" : "Show"} Description`}
          </div>
          <div className={`viz-desc ${headerExtended ? "extended" : ""}`}>
            {data.desc?.map((line, i) => 
              <div className="desc-line" key={`desc-line-${i}`}>{line}</div> )
            }
          </div>
        </div>
        <div className="chart-info">
          {data.info && 
            <div className="visual-name">
              <div className="label">{data.info.label}</div>
              <div className="name">{data.info.name}</div>
            </div>
          }
        </div>
      </div>
      <div className={`viz-container ${headerExtended ? "with-extended-header" : ""}`} ref={containerRef}>
        <svg width="100%" height="100%">
          <g ref={zoomGRef}>
            <g className="vis-contents"></g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default QuadrantsBarChartVisual;


