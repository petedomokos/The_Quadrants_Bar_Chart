import './App.css';
import React, { useState, useCallback } from 'react'
import Header from "./Header";
import QuadrantsBarChartVisual from './quadrantsBarChartVisual/QuadrantsBarChartVisual';
import { getRehabDataForVisuals, createMockDataForVisuals } from './mock/mockData';

const exampleItems = [
  { key:"sports-rehab", name:"24 Sports Rehabilitation Sessions" },
  { key:"mock-dataset-500", name:"500 Sets Of Mock Data" }

]
function App() {
  const [selectedExample, setSelectedExample] = useState(exampleItems[0].key);
  const data = selectedExample === 'mock-dataset-500' ? createMockDataForVisuals(500) : getRehabDataForVisuals(24);

  const handleSelectExample = useCallback(key => {
    //remove existing
    setSelectedExample(key)

  }, [selectedExample]);
  return (
    <div className="app">
      <Header menuItems={exampleItems} selected={selectedExample} onSelect={handleSelectExample} />
      <div className="content">
        <QuadrantsBarChartVisual data={data} settings={{ nrRows: 3 }}/>
      </div>
    </div>
  );
}

export default App;
