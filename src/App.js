import './App.css';
import QuadrantsBarChartVisual from './quadrantsBarChartVisual/QuadrantsBarChartVisual';
import { /*getRehabDataForVisuals,*/ createMockDataForVisuals } from './mock/mockData';

function App() {
  const mockData =  createMockDataForVisuals(10);
  //const rehabData = getRehabDataForVisuals(24);
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
