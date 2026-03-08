import { Route, Routes } from 'react-router-dom';
import Login from 'pages/login/Login';
import MainLayout from 'components/layouts/MainLayout';
import Portfolio from 'pages/portfolio';
import Doctor from './pages/doctor/Doctor';
import RoleHome from './pages/RoleHome/RoleHome';
// import './App.css';
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Portfolio />}></Route>
          <Route path = "/doctor" element = {<Doctor />} />
          <Route path = "/role_home" element = {<RoleHome />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
