import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; 


function App() {
  return (
<BrowserRouter>
  <AuthProvider>
   <div className="container py-5">
      <h1 className="mb-3">Mini Blog</h1>
      <p>Frontend is running! WooHoo</p>
    </div>
  </AuthProvider>
</BrowserRouter>

    


  );
}

export default App;