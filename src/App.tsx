import React from 'react';
import {Routes, Route} from 'react-router-dom'

import './App.css';
import { Header } from './components';
import { Home } from './pages';

const App:React.FC = () => {
  return (
    <div >
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>

      </Routes>
      
    </div>
  );
}

export default App;
