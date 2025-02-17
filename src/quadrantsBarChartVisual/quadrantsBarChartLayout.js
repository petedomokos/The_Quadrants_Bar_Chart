import { sortAscending, sortDescending } from '../helpers/ArrayHelpers';
import { percentageScoreConverter } from '../helpers/dataHelpers';

//note i starts at 0, as does rowNr and colNr
const calcRowNr = (i, nrCols) => Math.floor(i / nrCols);
const calcColNr = (i, nrCols) => i % nrCols;

/*
    @todo rewrite as a proper d3 layout function instead of using settings as a parameter
*/
export const quadrantsBarChartLayout = (data, settings={}) => {
    const { measures, datapoints } = data;
    const { nrCols } = settings;
    return datapoints.map((datapoint,i) => ({
        key:datapoint.key,
        title:datapoint.title,
        quadrantsData:datapoint.categoriesData.map((categoryData, j) => {
            const unorderedValues = categoryData
                .values
                .map(v => {
                    const measure = measures.find(m => m.key === v.measureKey);
                    const { preInjuryValue, range, name, label } = measure;
                    const convertToPC = percentageScoreConverter(preInjuryValue, { range, useRangeAsBound:true });
                    const value = convertToPC(v.value);
                    return {
                        ...v,
                        rawValue:v.value,
                        value,
                        name,
                        label,
                        calcBarHeight:maxHeight => (value/100) * maxHeight
                    }
                });

            return {
                key:`quad-${j+1}`,
                i:j,
                ...categoryData,
                values: j === 0 || j === 2 ? sortAscending(unorderedValues, v => v.value) : sortDescending(unorderedValues, v => v.value)
            }
        }),
        i,
        rowNr:calcRowNr(i, nrCols),
        colNr:calcColNr(i, nrCols)
    }))
}