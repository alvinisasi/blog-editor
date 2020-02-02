import React, { lazy, Suspense } from 'react';
import './App.css';
import 'tachyons'

const Client = lazy(() => import('./layouts/Client'))
const Dashboard = lazy(() => import('./layouts/Dashboard'))

function Layout(props) {
  const isAuthenticated = props.isAuthenticated
  if(isAuthenticated){
    return <Dashboard />
  } else {
    return <Client />
  }
}

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Layout isAuthenticated={true} />
      </Suspense>
    </div>
  );
}


export default App;
