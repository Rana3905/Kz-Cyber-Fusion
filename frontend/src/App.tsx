import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Detectors from './pages/Detectors';
import Incidents from './pages/Incidents';
import IncidentDetailPage from './pages/IncidentDetailPage';
import Assistant from './pages/Assistant';
import Evidence from './pages/Evidence';
import Response from './pages/Response';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="detectors" element={<Detectors />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="incidents/:id" element={<IncidentDetailPage />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="evidence/:id" element={<Evidence />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="response" element={<Response />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
