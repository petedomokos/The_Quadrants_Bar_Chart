import { range } from 'd3';

const categories = [
  { key:"sharpness", name:"Sharpness" },
  { key:"cardio", name:"Cardio" },
  { key:"postural", name:"Postural" },
  { key:"technical", name:"Technical" },
]

const measures = [
  //sharpness
  { postInjuryValue:27.2, key:"s1", label:"Max Speed", name:"", categoryKey:"sharpness" },
  { postInjuryValue:13.2, key:"s2", label:"S2", name:"", categoryKey:"sharpness" },
  { postInjuryValue:13.2, key:"s3", label:"S3", name:"", categoryKey:"sharpness" },
  { postInjuryValue:13.2, key:"s4", label:"S4", name:"", categoryKey:"sharpness" },
  { postInjuryValue:13.2, key:"s5", label:"S5", name:"", categoryKey:"sharpness" },
  //cardio
  { postInjuryValue:13.2, key:"c1", label:"High Speed Runs", name:"", categoryKey:"cardio" },
  { postInjuryValue:13.2, key:"c2", label:"Med Speed Runs", name:"", categoryKey:"cardio" },
  { postInjuryValue:13.2, key:"c3", label:"Total Distance (km)", name:"", categoryKey:"cardio" },
  { postInjuryValue:13.2, key:"c4", label:"Nr of Actions", name:"", categoryKey:"cardio" },
  { postInjuryValue:13.2, key:"c5", label:"HR Recovery (sec)", name:"", categoryKey:"cardio" },
  //postural
  { postInjuryValue:13.2, key:"p1", label:"P1", name:"", categoryKey:"postural" },
  { postInjuryValue:13.2, key:"p2", label:"P2", name:"", categoryKey:"postural" },
  { postInjuryValue:13.2, key:"p3", label:"P3", name:"", categoryKey:"postural" },
  { postInjuryValue:13.2, key:"p4", label:"P4", name:"", categoryKey:"postural" },
  { postInjuryValue:13.2, key:"p5", label:"P5", name:"", categoryKey:"postural" },
  //technical
  { postInjuryValue:13.2, key:"t1", label:"T1", name:"", categoryKey:"technical" },
  { postInjuryValue:13.2, key:"t2", label:"T2", name:"", categoryKey:"technical" },
  { postInjuryValue:13.2, key:"t3", label:"T3", name:"", categoryKey:"technical" },
  { postInjuryValue:13.2, key:"t4", label:"T4", name:"", categoryKey:"technical" },
  { postInjuryValue:13.2, key:"t5", label:"T5", name:"", categoryKey:"technical" },
]

const valuesForSessionsPostInjury = {
  //cat 1 - sharpness
  s1:[24, 24.2, 24.3, 24.8, 25.1, 25, 24.8, 24.7, 25, 25.2, 26, 26.5, 26, 26.7, 27, 27.1, 27.2, 28, 27.6, 27.5],
  s2:[4.6, 5.2, 6, 6.5, 6,],
  s3:[9, 9.5, 9.8, 9.9],
  s4:[11, 11, 11.5, 10, 11.9],
  s5:[10, 10.5, 10.6, 10.7, 11],
  //cat 2 - cardio
  c1:[9, 9.4, 9.7, 10.4],
  c2:[7, 7.9, 7.8, 8.3],
  c3:[9, 9.3, 10.2, 10.8],
  c4:[8, 8.3, 8.9, 10],
  c5:[10, 10.7, 10.9, 11.5],
  //cat 3 - postural
  p1:[11, 11.7, 11.9, 12.1],
  p2:[11, 11, 11.6, 12.1],
  p3:[12, 12.5, 12.8, 12.9],
  p4:[13, 12.9, 13, 13.9],
  p5:[10.7, 11.6, 11.9, 13],
  //cat 4 - technical
  t1:[10, 10.8, 13.7, 12.5],
  t2:[11, 11.7, 11.7, 11.3],
  t3:[11.5, 11.9, 12.7, 13.8],
  t4:[10.3, 10.9, 10.8, 11.4],
  t5:[13, 13.6, 12.7, 13.7],
}

export const getRehabData = (nrSessions=20) => {
  return {
    title:"Rehab Tracker of Post-Injury Training Sessions",
    desc:[
        "Shows player's journey towards being ready to perform, based on pre-injury indicators across 4 categories.",
        "When all bars are filled in 100%, it shows a perfect square which means the player is back to pre-injury levels.",
        "Click on a chart to enlarge/reduce a category."
    ],
    playerName:"James Stevens",
    targetValues:measures.map(m => ({ key:m.key, value:m.postInjuryValue })),
    chartsData:range(1, nrSessions+1).map(n => createSessionData(n))
  }
}

function createSessionData(sessionNr){
  return {
    key:`session-${sessionNr}`,
    title:`Session ${sessionNr}`,
    quadrantsData:[1,2,3,4].map(quadrantNr => createQuadrantData(sessionNr, quadrantNr))
  }
}

function createQuadrantData(sessionNr, quadrantNr){
  const quadrantCategory = categories[quadrantNr-1];
  return {
    key:`session-${sessionNr}-quadrant-${quadrantNr}`,
    title:quadrantCategory.name,
    values:measures
      .filter(m => m.categoryKey === quadrantCategory.key)
      .map(m => ({
        ...m,
        value:valuesForSessionsPostInjury[m.key] ? valuesForSessionsPostInjury[m.key][sessionNr-1] : null
      }))
  }
}

export const quadrantsBarChartsData = {
    title:"Quadrant Bar Chart Display",
    desc:"description of the charts goes here",
    chartsData:[
      {
        key:"quadrant-bar-chart-1",
        title:"Chart 1",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-2",
        title:"Chart 2",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-3",
        title:"Chart 3",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-4",
        title:"Chart 4",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-5",
        title:"Chart 5",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-6",
        title:"Chart 6",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-7",
        title:"Chart 7",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
      {
        key:"quadrant-bar-chart-8",
        title:"Chart 8",
        desc:"description of the chart goes here",
        quadrantsData:[
          {
            key:"quad1",
            title:"Quad 1",
            values:[
              { label:"1A", value:90 }, { label:"1B", value:80 }, { label:"1C", value:70 }, { label:"1D", value:70 }, { label:"1E", value:70 }
            ],
          },
          {
            key:"quad2",
            title:"Quad 2",
            values:[
              { label:"2A", value:50 }, { label:"2B", value:50 }, { label:"2C", value:30 }, { label:"2D", value:30 }, { label:"2E", value:20 }
            ],
          },
          {
            key:"quad3",
            title:"Quad 3",
            values:[
              { label:"3A", value:69 }, { label:"3B", value:65 }, { label:"3C", value:80 }, { label:"3D", value:90 }, { label:"3E", value:50 }
            ],
          },
          {
            key:"quad4",
            title:"Quad 4",
            values:[
              { label:"4A", value:89 }, { label:"4B", value:69 }, { label:"4C", value:53 }, { label:"4D", value:63 }, { label:"4E", value:75 }
            ],
          }
        ]
      },
    ]
  }