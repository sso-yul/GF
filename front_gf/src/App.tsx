import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
    const [test, setTest] = useState("");

    useEffect(() => {
        axios.get("/api/test")
        .then(response => setTest(response.data))
        .catch(error => console.log(error))
    }, []);
    return (
        <>
            {test}
        </>
    )
}

export default App
