import logo from './logo.svg';
import './App.css';
import QuadrantsBarChart from './quadrantsBarChart/QuadrantsBarChart';
import { getRehabData } from './mock/mockData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/**<img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>*/}
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
        <QuadrantsBarChart data={getRehabData(16)} settings={{ nrRows: 2 }}/>

      </div>
    </div>
  );
}

export default App;
