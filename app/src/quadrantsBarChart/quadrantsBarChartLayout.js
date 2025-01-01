import { sortAscending, sortDescending } from '../helpers/ArrayHelpers';
import { convertToPC } from '../helpers/dataHelpers';

//note i starts at 0, as does rowNr and colNr
const calcRowNr = (i, nrCols) => Math.floor(i / nrCols);
const calcColNr = (i, nrCols) => i % nrCols;

//console.log("10 items in grid of 2 cols", colNr(9, 2), colNr(2,2))
//@todo rewrite as a proper d3 layout function instead of using settings as a parameter
export const quadrantsBarChartLayout = (data, settings={}) => {
    //console.log("data....", data)
    const { targetValues, chartsData } = data;
    const { nrCols } = settings;
    return chartsData.map((chartData,i) => ({
        ...chartData,
        quadrantsData:chartData.quadrantsData.map((quadrantData, j) => {
            const unorderedValues = quadrantData
                .values
                .map(v => ({
                    ...v,
                    rawValue:v.value,
                    value:convertToPC(0, targetValues.find(t => t.key === v.key).value)(v.value)
                }));

            console.log("unorderedValues", unorderedValues)
            return {
                key:`quad-${j+1}`,
                i:j,
                ...quadrantData,
                values: j == 0 || j == 2 ? sortAscending(unorderedValues, v => v.value) : sortDescending(unorderedValues, v => v.value)
            }
        }),
        i,
        rowNr:calcRowNr(i, nrCols),
        colNr:calcColNr(i, nrCols)
    }))
}