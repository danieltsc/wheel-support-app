import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './pages/Home/Home'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='*' component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
