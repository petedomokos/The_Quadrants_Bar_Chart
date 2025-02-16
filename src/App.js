import './App.css';
import QuadrantsBarChartVisual from './quadrantsBarChartVisual/QuadrantsBarChartVisual';
import { getRehabDataForVisuals, createMockDataForVisuals } from './mock/mockData';

function App() {
  const mockData =  createMockDataForVisuals(24);
  const rehabData = getRehabDataForVisuals(24);
  console.log("mock", mockData)
  console.log('rehab', rehabData)
  const quadrantsBarChartVisualData = mockData;
  return (
    <div className="app">
      <header className="app-header">
        <div>
          The 4 Quadrants Bar Chart: Sports Injury Example
        </div>
      </header>
      <div className="content">
        <QuadrantsBarChartVisual data={quadrantsBarChartVisualData} settings={{ nrRows: 3 }}/>
      </div>
    </div>
  );
}

export default App;
