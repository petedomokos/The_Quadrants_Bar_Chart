import * as d3 from 'd3';
import { isNumber } from '../helpers/dataHelpers';
import { remove, fadeIn } from '../helpers/domHelpers';
import { COLOURS } from "../constants";

const { BLUE, LIGHT_BLUE, GREY } = COLOURS;

export default function quadrantsBarChart() {
    // settings that apply to all quadrantsBartCharts, in case there is more than 1 eg a row of players
    let margin = { left:0, right:0, top: 0, bottom:0 };
    let width = 800;
    let height = 600;
    let contentsWidth;
    let contentsHeight;

    let chartTitleHeight;

    let axesStrokeWidth;
    let quadrantWidth;
    let quadrantHeight;
    let quadrantTitleHeight;

    let barsAreaWidth;
    let barsAreaHeight;
    let extraHorizMargin;
    let extraVertMargin;

    let styles = {
        chart:{
            title:{
                fontSize:12
            }
        },
        quadrant:{
            title:{
                fontSize:10
            },
            selectedTitle:{
                fontSize:10
            }
        },
        bar:{
            fontSize:10
        }
    }

    //settings
    let withQuadrantTitles;
    let withBarLabels;

    function updateDimns(){
        const maxContentsWidth = width - margin.left - margin.right;
        const maxContentsHeight = height - margin.top - margin.bottom;
        //set chartTitleheight to reduce down to a min
        chartTitleHeight = d3.max([18, maxContentsHeight * 0.1]);
        quadrantTitleHeight = 20;
        withQuadrantTitles = true;
        withBarLabels = true;
        if(maxContentsWidth < 100 || maxContentsHeight < 120){
            //remove quad labels
            withQuadrantTitles = false;
            quadrantTitleHeight = 0;
        }
        if(maxContentsWidth < 40 || maxContentsHeight < 70){
            chartTitleHeight = 16;
            withBarLabels = false;
        }
        if(maxContentsWidth < 25 || maxContentsHeight < 40){
            chartTitleHeight = 0;
        }

        //contentsheight includes space for quad titles, whereas contenstWidth doesnt
        contentsWidth = d3.min([maxContentsWidth, maxContentsHeight - chartTitleHeight - 2 * quadrantTitleHeight]);
        contentsHeight = contentsWidth + chartTitleHeight + 2 * quadrantTitleHeight;

        const extraHorizSpace = maxContentsWidth - contentsWidth;
        const extraVertSpace = maxContentsHeight - contentsHeight;
        extraHorizMargin = extraHorizSpace/2;
        extraVertMargin = extraVertSpace/2;

        axesStrokeWidth = d3.min([10, contentsWidth * 0.01]);
        quadrantWidth = (contentsWidth - axesStrokeWidth)/2;
        //quadrant title is part of the quadrant, whereas chart title is not, so we subtract it
        quadrantHeight = (contentsHeight - chartTitleHeight - axesStrokeWidth)/2;
        //Each bar area works out as a square because of the way dimns are done above
        barsAreaWidth = quadrantWidth;
        barsAreaHeight = quadrantHeight - quadrantTitleHeight;

        //styles that are based on dimns
        styles.chart.title.fontSize = chartTitleHeight * 0.4;
        styles.quadrant.title.fontSize = quadrantHeight * 0.11;
        styles.quadrant.selectedTitle.fontSize = quadrantHeight * 0.11;
        styles.bar.fontSize = quadrantHeight * 0.09;
    };

    //state
    let selectedQuadrantIndex = null;
    //handlers
    let setSelectedQuadrantIndex = () => {};

    function chart(selection) {
        updateDimns();

        selection.each(function (data,i) {
            if(d3.select(this).selectAll("*").empty()){ init(this, data); }
            update(this, data);
        })

        function init(containerElement, data, settings={}){
            //'this' is the container
            const container = d3.select(containerElement);
            //here do anything for the chart that isnt repeated for all quadrants
            //or just remove the init-update functions altogether
            //bg
            container.append("rect").attr("class", "chart-bg")
                .attr("stroke", "none")
                .attr("fill", "transparent");

            const contentsG = container.append("g").attr("class", "contents");
            //chart title and contents gs
            const chartTitleG = contentsG.append("g").attr("class", "chart-title");
            const chartContentsG = contentsG.append("g").attr("class", "chart-contents");

            //title
            chartTitleG
                .append("text")
                    .attr("class", "primary")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "central")
                        .attr("opacity", 0.55)
                        .attr("stroke-width", 0.1);

            //g that handles scaling when selections made
            chartContentsG.append("g").attr("class", "scale");
        }

        function update(containerElement, data, settings={}){
            //'this' is the container
            const container = d3.select(containerElement);
            //bg
            container.select("rect.chart-bg")
                .attr("width", `${width}px`)
                .attr("height", `${height}px`)
                .attr("cursor", isNumber(selectedQuadrantIndex) ? "pointer" : null)
                .on("click", e => {
                    if(isNumber(selectedQuadrantIndex)){
                        setSelectedQuadrantIndex("");
                    }
                });

            const contentsG = container.select("g.contents")
                .attr("transform", `translate(${margin.left + extraHorizMargin}, ${margin.top + extraVertMargin})`)

            //chart title
            const chartTitleG = contentsG.select("g.chart-title");
            chartTitleG.select("text.primary")
                .attr("transform", `translate(${contentsWidth/2}, ${chartTitleHeight/2})`)
                .attr("font-size", styles.chart.title.fontSize)
                .text(data.title || "")

            //Chart contents
            const chartContentsG = contentsG.select("g.chart-contents")
                .attr("transform", `translate(0, ${chartTitleHeight})`);

            //scaling transforms
            const scaleG = chartContentsG.select("g.scale");

            const chartTransformOrigin = 
                selectedQuadrantIndex === 0 ? `${contentsWidth} ${contentsHeight}` :
                selectedQuadrantIndex === 1 ? `0 ${contentsHeight}` :
                selectedQuadrantIndex === 2 ? `${contentsWidth} 0` :
                `0 0`;

            scaleG
                .transition()
                .delay(isNumber(selectedQuadrantIndex) ? 0 : 75)
                .duration(500)
                    .attr("transform", `scale(${isNumber(selectedQuadrantIndex) ? 0.5 : 1})`)
                    .attr("transform-origin", chartTransformOrigin);

            //Quadrants
            const quadrantContainerG = scaleG.selectAll("g.quadrant-container").data(data.quadrantsData, d => d.key)
            quadrantContainerG.enter()
                .append("g")
                    .attr("class", (d,i) => `quadrant-container quandrant-container-${d.key}`)
                    .attr("cursor", "pointer")
                    .each(function(d,i){
                        const quadrantContainerG = d3.select(this);
                        const quadrantG = quadrantContainerG.append("g").attr("class", "quadrant")

                        quadrantG
                            .append("text")
                                .attr("class", "quadrant-title")
                                .attr("text-anchor", "middle")
                                .attr("dominant-baseline", "central")
                                .attr("stroke-width", 0.1)
                                .attr("opacity", withQuadrantTitles ? 0.5 : 0)
                                .attr("display", withQuadrantTitles ? null : "none");

                        const shouldShowSelectedQuadrantTitle = !withQuadrantTitles && selectedQuadrantIndex === i;
                        quadrantG
                            .append("text")
                                .attr("class", "selected-quadrant-title")
                                    .attr("text-anchor", "middle")
                                    .attr("dominant-baseline", i < 2 ? null : "hanging")
                                    .attr("stroke-width", 0.1)
                                    .attr("display", shouldShowSelectedQuadrantTitle ? null : "none")
                                    .attr("opacity", shouldShowSelectedQuadrantTitle ? 0.5 : 0)


                        const barsAreaG = quadrantG.append("g").attr("class", "bars-area");
                        barsAreaG
                            .append("rect")
                                .attr("class", "bars-area-bg")
                                .attr("stroke", isNumber(selectedQuadrantIndex) && selectedQuadrantIndex !== i ? GREY : BLUE)
                                .attr("stroke-width", isNumber(selectedQuadrantIndex) && selectedQuadrantIndex !== i ? 0.1 : 0.3)
                                .attr("fill", "transparent");
                         
                        barsAreaG.append("g").attr("class", "bars");
                    })
                    .merge(quadrantContainerG)
                    .attr("transform", (d,i) => `translate(${(i === 0 || i === 2) ? 0 : quadrantWidth + axesStrokeWidth}, ${(i === 0 || i === 1) ? 0 : quadrantHeight + axesStrokeWidth})`)
                    .on("click", function(e,d){
                        e.stopPropagation();
                        if(selectedQuadrantIndex !== d.i){
                            setSelectedQuadrantIndex(d.i)
                        }else{
                            setSelectedQuadrantIndex("")
                        }
                    })
                    .each(function(quadD,i){
                        const quadrantContainerG = d3.select(this);
                        //make sure bar labels etc are on top of DOM
                        if(selectedQuadrantIndex === i){ quadrantContainerG.raise(); }

                        const quadScale = i === selectedQuadrantIndex ? 3 : 1;
                        const quadTransformOrigin =
                            selectedQuadrantIndex === 0 ? `${quadrantWidth} ${quadrantHeight}` :
                            selectedQuadrantIndex === 1 ? `0 ${quadrantHeight}` :
                            selectedQuadrantIndex === 2 ? `${quadrantWidth} 0` :
                            `0 0`;

                        const quadrantG = quadrantContainerG.select("g.quadrant");
                        quadrantG
                            .transition()
                            .delay(isNumber(selectedQuadrantIndex) ? 75 : 0)
                            .duration(500)
                                .attr("transform", `scale(${quadScale})`)
                                .attr("transform-origin", quadTransformOrigin);

                        const titleShiftHoriz = i === 0 || i === 2 ? barsAreaWidth/2 : barsAreaWidth/2;
                        const titleShiftVert = i === 0 || i === 1 ? quadrantTitleHeight/2 : quadrantHeight - quadrantTitleHeight/2;
                        quadrantG.select("text.quadrant-title")
                            .attr("transform", `translate(${titleShiftHoriz}, ${titleShiftVert})`)
                            .attr("font-size", styles.quadrant.title.fontSize)
                            .text(quadD.title)
                                .transition()
                                .duration(200)
                                    .attr("opacity", withQuadrantTitles ? 0.5 : 0)
                                    .on("end", function(){ d3.select(this).attr("display", withQuadrantTitles ? null : "none") });


                        const shouldShowSelectedQuadrantTitle = !withQuadrantTitles && selectedQuadrantIndex === i;
                        const selectedQuadrantTitleText = quadrantG.select("text.selected-quadrant-title");
                        //@todo - use a fadeIn custom function that checks for this
                        if(shouldShowSelectedQuadrantTitle && selectedQuadrantTitleText.attr("display") === "none"){ selectedQuadrantTitleText.attr("display", null) }
                        selectedQuadrantTitleText
                            .attr("x", quadrantWidth/2)
                            .attr("y", i < 2 ? -2 : quadrantHeight + 2)
                            .attr("font-size", styles.quadrant.selectedTitle.fontSize)
                            .text(quadD.title)
                                .transition()
                                .duration(500)
                                    .attr("opacity", shouldShowSelectedQuadrantTitle ? 0.5 : 0)
                                        .on("end", function(){ d3.select(this).attr("display", shouldShowSelectedQuadrantTitle ? null : "none")})
                        
                        const barAreaShiftVert = i === 0 || i === 1 ? quadrantTitleHeight : 0;
                        const barsAreaG = quadrantG.select("g.bars-area")
                            .attr("transform", `translate(0, ${barAreaShiftVert})`);

                        barsAreaG.select("rect.bars-area-bg")
                            .attr("width", barsAreaWidth)
                            .attr("height", barsAreaHeight);

                        barsAreaG.select("rect.bars-area-bg")
                                .transition()
                                .duration(500)
                                    .attr("stroke", isNumber(selectedQuadrantIndex) && selectedQuadrantIndex !== i ? GREY : BLUE)
                                    .attr("stroke-width", isNumber(selectedQuadrantIndex) && selectedQuadrantIndex !== i ? 0.1 : 0.3)

                        //bars
                        const nrBars = quadD.values.length;
                        const nrGaps = nrBars - 1;
                        const potentialTotalSpaceForGaps = barsAreaWidth * 0.05;
                        const potentialGapBetweenBars = potentialTotalSpaceForGaps / nrGaps;
                        //gap must not be as large as the axeswidth
                        const gapBetweenBars = d3.min([axesStrokeWidth * 0.7, potentialGapBetweenBars]);
                        const totalSpaceForBars = barsAreaWidth - gapBetweenBars * nrGaps;
                        const barWidth = totalSpaceForBars/nrBars;
                        const barLabelWidth = 15;
                        const barLabelHeight = 4;
                        const horizLabelMargin = barWidth * 0.2;

                        //@todo - base this showing on zoomScale * quadrantsWidth
                        const shouldShowBars = true;
                        const barsData = shouldShowBars ? quadD.values : [];

                        const barsG = barsAreaG.select("g.bars");
                        const barG = barsG.selectAll("g.bar").data(barsData, d => d.key);
                        barG.enter()
                            .append("g")
                                .attr("class", `bar`) 
                                .each(function(barD,j){
                                    const barHeight = barD.calcBarHeight(barsAreaHeight);
                                    const barG = d3.select(this);
                                    barG
                                        .append("rect")
                                            .attr("class", "bar")
                                                .attr("width", barWidth)
                                                .attr("height", barHeight)
                                                .attr("fill", !isNumber(selectedQuadrantIndex) || selectedQuadrantIndex === j ? BLUE : GREY);
                                })
                                .merge(barG)
                                .each(function(barD,j){

                                    const barHeight = barD.calcBarHeight(barsAreaHeight);
                                    //no space between bars and outer edge of chart
                                    const barG = d3.select(this)
                                        .attr("transform", `translate(${j * (barWidth + gapBetweenBars)},${i < 2 ? barsAreaHeight - barHeight : 0})`);

                                    barG.select("rect.bar")
                                        .transition()
                                        .duration(500)
                                            .attr("width", barWidth)
                                            .attr("height", barHeight)
                                            .attr("fill", !isNumber(selectedQuadrantIndex) || selectedQuadrantIndex === i ? BLUE : GREY);

                                    //labels
                                    /*
                                    const shouldShowLabels = withBarLabels && selectedQuadrantIndex === j;
                                    const labelG = barG.selectAll("g.bar-label").data(shouldShowLabels ? [1] : []);
                                    labelG.enter()
                                        .append("g")
                                            .attr("class", "bar-label")
                                            .call(fadeIn)
                                            .each(function(){
                                                const labelG = d3.select(this);
                                                labelG.append("rect")
                                                    .attr("fill", LIGHT_BLUE)
                                                    .attr("stroke-width", 0.3)
                                                    .attr("rx", "2")
                                                    .attr("ry", "2");
                                                
                                                labelG.append("text")
                                                    .attr("x", barLabelWidth/2)
                                                    .attr("y", `${barLabelHeight/2}`)
                                                    .attr("dominant-baseline", "central")
                                                    .attr("text-anchor", "middle")
                                                    .attr("fill", "white")
                                                    .attr("stroke", "white")
                                                    .attr("stroke-width", 0.1)
                                                    .attr("font-size", styles.bar.fontSize)
                                                    .text(barD.label);
                                            })
                                            .merge(labelG)
                                            .each(function(){
                                                const labelG = d3.select(this);
                                                const vertAdjustmentForOverlap = 2.5;
                                                const labelAngle = -45;
                                                //@todo - if angel not 45, need to use toRadians function
                                                const labelAngleRads = Math.PI/4;
                                                const labelX = i < 2 ? -(barLabelWidth * Math.cos(labelAngleRads)) + horizLabelMargin : horizLabelMargin; 
                                                const labelY = i < 2 ? (barHeight - vertAdjustmentForOverlap) + (barLabelWidth * Math.sin(labelAngleRads)) : 0; 
                                                const shouldShowlabels = withBarLabels && selectedQuadrantIndex === i;
                                                
                                                //turn display on before fade in if necc
                                                //@todo - use a fadeIn custom function that checks for this
                                                if(shouldShowlabels && labelG.attr("display") === "none"){ labelG.attr("display", null) }
                                                labelG
                                                    .attr("transform", `translate(${labelX} ${labelY}) rotate(${labelAngle})`)
                                                    .transition()
                                                    .duration(500)
                                                        .attr("opacity", shouldShowlabels ? 1 : 0)
                                                        //if revealing them, we need to set display to null before trans
                                                        //.on("end", function(){ d3.select(this).attr("display", shouldShowlabels ? null : "none" )});

                                                labelG.select("rect")
                                                    .attr("width", `${barLabelWidth}px`)
                                                    .attr("height", `${barLabelHeight}px`)
                                                    .attr("opacity", 0.8);

                                            })
                                    */
                                })

                        barG.exit().call(remove);

                        /*
                        //@todo - use this outline path option for larger dataset on screen"
                        const outlineData = shouldShowBars ? [] : [quadD.values];
                        const outlineG = barsG.selectAll("g.outline").data(outlineData)
                        outlineG.enter()
                            .append("g")
                                .attr("class", "outline")
                                .each(function(values){
                                    d3.select(this).append("path")
                                        .attr("stroke", "red")
                                        .attr("stroke-width", 0.4)
                                        .attr("fill", "none")
                                })
                                .merge(outlineG)
                                //.attr("transform", `translate(0, ${quadrantHeight})`)
                                .each(function(values){
                                    d3.select(this).select("path")
                                        .attr("d", quadrantPathD(values, i, barWidth, barsAreaHeight, gapBetweenBars))
                                })

                        outlineG.exit().call(remove);
                        */

                    })
            
            quadrantContainerG.exit().call(remove);

            /*
            //@todo - use this path option for larger dataset on screen"

            function quadrantPathD(values, quadIndex, barWidth, barsAreaHeight, gapBetweenBars){
                const barsOutline = values
                    .map((v,k) => {
                        if(quadIndex <= 1){
                            //only draw 2nd vert line for last bar
                            if(k < values.length - 1){ return `v ${-v.calcBarHeight(barsAreaHeight)} h ${barWidth + gapBetweenBars} m 0 ${v.calcBarHeight(barsAreaHeight)}` }
                            return `v ${-v.calcBarHeight(barsAreaHeight)} h ${barWidth} v ${v.calcBarHeight(barsAreaHeight)}`
                        }else{
                            //only draw 2nd vert line for last bar
                            if(k < values.length - 1){ return `v ${v.calcBarHeight(barsAreaHeight)} h ${barWidth + gapBetweenBars} m 0 ${-v.calcBarHeight(barsAreaHeight)}` }
                            return `v ${v.calcBarHeight(barsAreaHeight)} h ${barWidth} v ${-v.calcBarHeight(barsAreaHeight)}`
                        }
                    })
                    .reduce((str1, str2) => `${str1}${str2}`)

                if(quadIndex <= 1){
                    return `M 0 ${barsAreaHeight} ${barsOutline} h ${-values.length * (barWidth) + -(values.length - 1) * gapBetweenBars} z`
                }
                return `M 0 0 ${barsOutline} h ${-values.length * (barWidth) + -(values.length - 1) * gapBetweenBars} z`
            }
            */

        }

        return selection;
    }

    //api
    chart.sizes = function (values) {
        if (!arguments.length) { return { width, height, margin }; }
        width = values.width || width;
        height = values.height || height;
        //@todo - add margin in, but this be on outside of each quadrant
        margin = values.margin ? { ...margin, ...values.margin } : margin;

        return chart;
    };
    chart.selectedQuadrantIndex = function (value) {
        if (!arguments.length) { return selectedQuadrantIndex; }
        selectedQuadrantIndex = value;
        return chart;
    };
    chart.setSelectedQuadrantIndex = function (func) {
        if (!arguments.length) { return setSelectedQuadrantIndex; }
        setSelectedQuadrantIndex = func;
        return chart;
    };
    return chart;
};
