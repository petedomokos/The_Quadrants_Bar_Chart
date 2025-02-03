import { sortAscending, sortDescending } from '../helpers/ArrayHelpers';
import { percentageScoreConverter } from '../helpers/dataHelpers';

//note i starts at 0, as does rowNr and colNr
const calcRowNr = (i, nrCols) => Math.floor(i / nrCols);
const calcColNr = (i, nrCols) => i % nrCols;

/*
    @todo rewrite as a proper d3 layout function instead of using settings as a parameter
*/
export const quadrantsBarChartLayout = (data, settings={}) => {
    const { measures, chartsData } = data;
    const { nrCols } = settings;
    return chartsData.map((chartData,i) => ({
        ...chartData,
        quadrantsData:chartData.quadrantsData.map((quadrantData, j) => {
            const unorderedValues = quadrantData
                .values
                .map(v => {
                    const measure = measures.find(m => m.key === v.measureKey);
                    const { preInjuryValue, range } = measure;
                    const convertToPC = percentageScoreConverter(preInjuryValue, { range, useRangeAsBound:true });
                    return {
                        ...v,
                        rawValue:v.value,
                        value:convertToPC(v.value)
                    }
                });

            return {
                key:`quad-${j+1}`,
                i:j,
                ...quadrantData,
                values: j === 0 || j === 2 ? sortAscending(unorderedValues, v => v.value) : sortDescending(unorderedValues, v => v.value)
            }
        }),
        i,
        rowNr:calcRowNr(i, nrCols),
        colNr:calcColNr(i, nrCols)
    }))
}