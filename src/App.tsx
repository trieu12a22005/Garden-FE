import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import MainLayout from "./components/layouts/mainLayout"

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App
