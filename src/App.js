import './App.css';
import QuadrantsBarChart from './quadrantsBarChart/QuadrantsBarChart';
import { getRehabData } from './mock/mockData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          The 4 Quadrants Bar Chart: Sports Injury Example
        </a>
      </header>
      <div className="content">
        <QuadrantsBarChart data={getRehabData(24)} settings={{ nrRows: 3 }}/>

      </div>
    </div>
  );
}

export default App;
