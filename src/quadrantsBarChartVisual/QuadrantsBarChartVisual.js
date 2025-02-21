import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3';
import { quadrantsBarChartLayout } from './quadrantsBarChartLayout';
import quadrantsBarChart from "./quadrantsBarChartComponent";
import quadrantsBarChartKey from "./quadrantsBarChartKeyComponent";
import { remove, fadeIn } from '../helpers/domHelpers';

const CONTAINER_MARGIN = { left:10, right:10, top:10, bottom:40 };
const TRANSITION_OUT = { 
  duration:800,
  delay: 50
}

const TRANSITION_IN = { 
  duration: 500, 
  delay:TRANSITION_OUT.delay + TRANSITION_OUT.duration + 200 
}

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
  const [chartKey, setChartKey] = useState(null);
  const [chartKeySmallScreen, setChartKeySmallScreen] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [selectedQuadrantIndex, setSelectedQuadrantIndex] = useState(null);
  const [selectedChartKey, setSelectedChartKey] = useState(null);
  const [headerExtended, setHeaderExtended] = useState(false);
  const [zoomState, setZoomState] = useState(d3.zoomIdentity);

  const chartMargin = (width, height) => ({ left:width * 0.1, right:width * 0.1, top:height * 0.1, bottom:height * 0.1 });

  const toggleHeaderExtended = e => {
    setHeaderExtended(prevState => !prevState);
  }

  const containerRef = useRef(null);
  const zoomGRef = useRef(null);
  const chartKeyRef = useRef(null);
  const chartKeySmallScreenRef = useRef(null);
  //store the actual zoom function so we can access its methods to get/set the transform
  const zoomRef = useRef(null);

  //chart
  useEffect(() => {
    setChart(() => quadrantsBarChart());
    setChartKey(() => quadrantsBarChartKey());
    setChartKeySmallScreen(() => quadrantsBarChartKey());
  },[])

  //sizes
  useEffect(() => {
    const chartSizes = calculateChartSizesAndGridLayout(containerRef.current, data.datapoints.length, CONTAINER_MARGIN, chartMargin);
    setSizes(chartSizes);
  },[data.datapoints.length])

  //change the overall viz dataset (not just the datapoints)
  useEffect(() => {
    setTimeout(() => {
      setSelectedQuadrantIndex(null);
      setSelectedChartKey("");
      if(zoomRef.current){ d3.select(containerRef.current).call(zoomRef.current.transform, d3.zoomIdentity); }
      setZoomState(d3.zoomIdentity);
    }, TRANSITION_OUT.delay + TRANSITION_OUT.duration)
  },[data.key])

  //render chartkey
  useEffect(() => {
    if(!chartKey){ return; }
    const chartKeyData = data.categories;
    //call key
    d3.select(chartKeyRef.current)
      ?.datum(chartKeyData)
      .call(chartKey
        .sizes({ width: 240, height: 140, margin:{ left:20, right: 20, top: 20, bottom:20 }})
        .selectedQuadrantIndex(selectedQuadrantIndex)
        .setSelectedQuadrantIndex(setSelectedQuadrantIndex));

    d3.select(chartKeySmallScreenRef.current)
      ?.datum(chartKeyData)
      .call(chartKeySmallScreen
        .sizes({ width: 190, height: 100, margin:{ left:10, right: 20, top: 20, bottom:20 }})
        .selectedQuadrantIndex(selectedQuadrantIndex)
        .setSelectedQuadrantIndex(setSelectedQuadrantIndex));

  }, [chartKey, chartKeySmallScreen, selectedQuadrantIndex, data.categories])

  //render chart
  useEffect(() => {
    if(!sizes){ return; }
    //data
    const processedDatapoints = quadrantsBarChartLayout(data, { nrCols: sizes.nrCols });
    //settings
    chart
        .sizes(sizes)
        .selectedQuadrantIndex(selectedQuadrantIndex)
        .selectedChartKey(selectedChartKey)
        .setSelectedChartKey(setSelectedChartKey)
        .zoomState(zoomState)

    //call chart
    const visContentsG = d3.select(containerRef.current).selectAll("g.vis-contents")
      .attr("transform", `translate(${sizes.containerMargin.left}, ${sizes.containerMargin.top})`)

    const chartG = visContentsG.selectAll("g.chart").data(processedDatapoints, d => d.key);
    chartG.enter()
      .append("g")
        .attr("class", "chart")
        .attr("id", d => `chart-${d.key}`)
        .call(fadeIn, { transition:TRANSITION_IN})
        .merge(chartG)
        .attr("transform", (d,i) => `translate(${d.colNr * sizes.width},${d.rowNr * sizes.height})`)
        .call(chart)

    chartG.exit().call(remove, { transition:TRANSITION_OUT})
  }, [chart, sizes, headerExtended])

  //selections
  useEffect(() => {
    //settings
    if(!chart){ return; }
    chart
        .selectedQuadrantIndex(selectedQuadrantIndex)
        .selectedChartKey(selectedChartKey)
        .setSelectedChartKey(setSelectedChartKey)

    //call chart
    d3.select(containerRef.current).selectAll("g.chart").call(chart)
  }, [chart, selectedQuadrantIndex, selectedChartKey, headerExtended])

  //zoom
  useEffect(() => {
    if(!sizes){ return; }
    if(!zoomRef.current){
      zoomRef.current = d3.zoom();
    }
    zoomRef.current
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [sizes.containerWidth, sizes.containerHeight]])
      .on("zoom", e => { setZoomState(e.transform); })

    //call zoom
    d3.select(containerRef.current).call(zoomRef.current);

    //update zoomstate in the dom
    d3.select(zoomGRef.current).attr("transform", zoomState);
    //pass zoomstate change onto component for other adjustments
    chart.zoomState(zoomState, true)
  },[chart, sizes, zoomState])

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
        <div className="viz-overview">
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
          <div className="viz-info">
              {data.info && 
                <div className="visual-name">
                  <div className="label">{data.info.label}</div>
                  <div className="name">{data.info.name}</div>
                </div>
              }
              <div className="key key-sm-only">
                <svg ref={chartKeySmallScreenRef}></svg>
              </div>
          </div>
        </div>
        <div className="key key-above-sm">
          <svg ref={chartKeyRef}></svg>
        </div>
      </div>
      <div className={`viz-container ${headerExtended ? "with-extended-header" : ""}`} ref={containerRef}>
        <svg className="viz" width="100%" height="100%">
          <g ref={zoomGRef}>
            <g className="vis-contents"></g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default QuadrantsBarChartVisual;


