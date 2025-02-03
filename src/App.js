import './App.css';
import QuadrantsBarChart from './quadrantsBarChart/QuadrantsBarChart';
import { getRehabData } from './mock/mockData';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          The 4 Quadrants Bar Chart: Sports Injury Example
        </div>
      </header>
      <div className="content">
        <QuadrantsBarChart data={getRehabData(24)} settings={{ nrRows: 3 }}/>
      </div>
    </div>
  );
}

export default App;
