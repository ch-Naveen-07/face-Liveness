import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LivenessDetection from './components/LivenessDetection';
import SuccessPage from './components/SuccessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LivenessDetection />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;