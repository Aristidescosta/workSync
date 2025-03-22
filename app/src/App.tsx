import RoutesConfig from "@routes/RoutesConfig"
import { ToastContainer } from 'react-toastify';
import { useUserSessionStore } from "@hooks";
import { useEffect } from "react";

function App() {
  const authenticationListener = useUserSessionStore(state => state.authenticationListener)


  useEffect(() => {

    const unsubscribe = authenticationListener(() => {

    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RoutesConfig />
    </>
  )
}

export default App
