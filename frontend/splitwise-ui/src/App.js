import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import GroupForm from './components/GroupForm';
import ExpenseForm from './components/ExpenseForm';
import GroupBalances from './components/GroupBalances';
import UserBalances from './components/UserBalances';

function App() {
  return (
  
      <Router>
      <div className="min-h-screen p-4 bg-gray-100">
        <nav className="mb-4 space-x-4">
          <Link to="/create-group" className="text-blue-600 hover:underline">Create Group</Link>
          <Link to="/add-expense" className="text-blue-600 hover:underline">Add Expense</Link>
          <Link to="/group-balances" className="text-blue-600 hover:underline">Group Balances</Link>
          <Link to="/user-balances" className="text-blue-600 hover:underline">User Balances</Link>
        </nav>
        <Routes>
          <Route path="/create-group" element={<GroupForm />} />
          <Route path="/add-expense" element={<ExpenseForm />} />
          <Route path="/group-balances" element={<GroupBalances />} />
          <Route path="/user-balances" element={<UserBalances />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
