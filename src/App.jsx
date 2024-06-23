import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header>
        <span>Greg's Goods</span>
      </header>
      <nav></nav>
      <div className="content"></div>
    </>
  );
}

export default App;
