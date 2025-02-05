import { Outlet } from 'react-router-dom';



function App() {

  return (
    <div>
       
      <main className='container pt-5'>
        <Outlet />
      </main>
    </div>
  )
}

export default App
