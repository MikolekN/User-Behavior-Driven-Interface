import "./App.css";
import { Link } from "react-router-dom";
import Login from "./routes/Login";



function App() {

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>

        <p>
          <Link to="dashboard">Dashboard</Link>
        </p>

      </div>

      <Login />

    </>
    
  )
}

export default App
