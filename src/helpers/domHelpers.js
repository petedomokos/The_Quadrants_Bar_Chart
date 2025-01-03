import * as d3 from "d3";
import { isNumber } from './dataHelpers';

const TRANSITIONS = {
    fast:50,
    med:200,
    slow:500
}

const classMatches = (selection, classNameToTest) => {
    const classStr = selection.attr("class");
    if(!classStr){ return false; }

    const classNames = classStr.split(" ");
    return !!classNames.find(c => c === classNameToTest)
}

const identifierMatches = (selection, identifier) => {
    return classMatches(selection, identifier) || selection.attr("id") === identifier;
}






//@todo - move these out as also used by Menu
export function hide(selection, options={}){
    const { delay, duration=200, onEnd, finalOpacity, startOpacity } = options;
    selection.each(function(){
        const element = d3.select(this);
        //check if already hidden or being hidden
        if(element.attr("class").includes("hidden")){ return; }
        //set init opacity if not set
        if(!element.style("opacity")){ element.style("opacity", 1) }
        //store prev opacity/display, set class before transition to avoid duplicate transitions
        element
            .classed("hidden", true)
            .attr("data-shown-display", element.style("display"))
            .attr("data-shown-opacity", element.style("opacity"))

        element
            .transition()
            .duration(duration)
                .attr("opacity", 0)
                    .on("end", function(){ d3.select(this).style("display", "none"); })
    })
}

export function show(selection, options={}){
    const { delay, duration=200, onEnd, finalOpacity, startOpacity } = options;
    selection.each(function(){
        const element = d3.select(this);
        //check if already shown or being shown
        if(!element.attr("class").includes("hidden")){ return; }
        //remove class before transition to avoid duplicate transitions
        element.classed("hidden", false);
        //hide
        element
            .transition()
            .duration(duration)
                .attr("opacity", element.style("data-shown-opacity"))
                    .on("end", function(){
                        d3.select(this).style("display", element.attr("data-shown-display"));
                    })
    })

}

export function fadeInOut(selection, shouldDisplay, options={}){
    const { transitionIn, transitionOut, transition } = options;
    //console.log("fadeInOut trans", transition)
    selection.each(function(){
        if(shouldDisplay){
            //console.log("call fadeIn")
            const transitionToUse = transitionIn || transition;
            d3.select(this).call(fadeIn, { ...options, transition:transitionToUse });
        }else{
            //console.log("call fadeOut")
            const transitionToUse = transitionOut || transition;
            d3.select(this).call(fadeOut, { ...options, transition:transitionToUse });
        }
    })
}

export function fadeIn(selection, options={}){
    const { transition, cb=()=>{}, display=null, opacity=1 } = options;
    selection.each(function(){
        //will be multiple exits because of the delay in removing
        const sel = d3.select(this);
        const isFadingIn = sel.attr("class").includes("fading-in");
        const currOpacity = sel.attr("opacity") ? +sel.attr("opacity") : null;
        const currDisplay = sel.attr("display");
        const somethingMustChange = currOpacity !== opacity || currDisplay !== display;
        //console.log("fadeIn?", currOpacity, opacity, currOpacity !== opacity)

        if(!isFadingIn && somethingMustChange){
            //console.log("fadeIn this", this)
            //console.log("fadeIn trans", transition)
            d3.select(this)
                .attr("opacity", d3.select(this).attr("opacity") || 0)
                //adjust display if required or if new value passed in
                .attr("display", currDisplay !== display ? display : currDisplay)
                .classed("fading-in", true)
                .transition("fade-in")
                    .delay(transition?.delay || 0)
                    .duration(isNumber(transition?.duration) ? transition.duration : TRANSITIONS.MED) //WAS CONTENT_FADE_DURATION FOR KPIS
                    .attr("opacity", opacity)
                    .on("end", function() { 
                        d3.select(this).classed("fading-in", false); 
                        cb.call(this);
                    });
        }
    })
}

export function fadeOut(selection, options={}){
    const { transition, cb=()=>{}, shouldRemove, display="none", opacity=0 } = options;
    selection.each(function(){
        //will be multiple exits because of the delay in removing
        const sel = d3.select(this);
        const isFadingOut = sel.attr("class").includes("fading-out");
        const currOpacity = sel.attr("opacity") ? +sel.attr("opacity") : null;
        const currDisplay = sel.attr("display");
        const somethingMustChange = currOpacity !== opacity || currDisplay !== display;
       
        if(!isFadingOut && somethingMustChange){
            d3.select(this)
                .attr("opacity", d3.select(this).attr("opacity") || 1)
                .classed("fading-out", true)
                .transition("fade-out")
                    .delay(transition?.delay || 0)
                    //.duration(transition?.duration || CONTENT_FADE_DURATION) - OLD, FOR KPIS
                    .duration(isNumber(transition?.duration) ? transition.duration : TRANSITIONS.MED)
                    .attr("opacity", opacity)
                    .on("end", function() { 
                        if(shouldRemove){ 
                            d3.select(this).remove(); 
                        }
                        else{
                            d3.select(this)
                                .attr("display", display)
                                .classed("fading-out", false); 
                        }
                        cb.call(this);
                    });
        }
    })
}

export function remove(selection, options={}){ 
    return fadeOut(selection, { ...options, shouldRemove:true })
}

