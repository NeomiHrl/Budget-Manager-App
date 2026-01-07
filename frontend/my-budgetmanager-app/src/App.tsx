import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Contexts/UserContext';


import Login from "./Components/Login"
import Register from "./Components/Register"
import GuestRoute from "./Components/GuestRoute"
import Header from './Components/Header';
import ProtectedRoute from './Components/ProtectedRoute';
import AddIncome from './Components/AddIncome';
import EditIncome from './Components/EditIncome';
import ResetPassword from './Components/ResetPassword';
import EditExpense from './Components/EditExpense';
import AddExpense from './Components/AddExpense';
import Contact from './Components/Contact';
import Footer from './Components/Footer';




// Sidebar import removed

import Home from './Pages/Home';
import About from './Pages/About';
import Profile from './Pages/Profile';
import Incomes from './Pages/Incomes';
import Expenses from './Pages/Expenses';
import Overview from './Pages/Overview';


export default function App() {

  return (
    <UserProvider>
      <Router>
        <Header />
        {/* Sidebar removed from here */}
        <Routes>
          <Route path="/incomes" element={
            <ProtectedRoute>
              <Incomes />
            </ProtectedRoute>   
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>   
          } />
          <Route path="/overview" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>   
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>   
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>   
          } />
          <Route path="/contact" element={<Contact />}/>
          <Route path="/about" element={<About />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>   
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>   
          } />
          <Route path="/add-income" element={
            <ProtectedRoute>
              <AddIncome />
            </ProtectedRoute>   
          } />
          <Route path="/edit-income/:id" element={
            <ProtectedRoute>
              <EditIncome />
            </ProtectedRoute>   
          } />
          <Route path="/edit-expense/:id" element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>   
          } />
          <Route path="/add-expense" element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>   
          } />

          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />
          <Route path="/forgot-password" element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          } />
          <Route path="/reset-password" element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          } />
         
        </Routes>
        <Footer />
        
      </Router>
    </UserProvider>
  )
}




