import { Route, Routes } from 'react-router-dom';
import Login from 'pages/login/Login';
import MainLayout from 'components/layouts/MainLayout';
import Portfolio from 'pages/portfolio';
// import './App.css';
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Portfolio />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
