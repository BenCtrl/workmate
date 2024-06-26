import NavBar from "./components/NavBar"
import WorkSpace from "./components/WorkSpace"
import './styling/shared.css'

function App() {
  const testStyling = {
    border: '1px solid green'
  }
  return (
    <>
      <NavBar />
      <WorkSpace />
    </>
  )
}

export default App
