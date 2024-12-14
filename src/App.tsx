import "./App.css";
import CalendarDiv from "./components/CalendarDiv";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="w-full h-full font-mono">
      <span className="text-5xl font-bold font-mono text-center flex p-3 justify-center">Event Schedulrr</span>
      <CalendarDiv />
      <Toaster />
    </div>
  );
}

export default App;
