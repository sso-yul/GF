import { useEffect, useState } from 'react'
import './App.css'
import { getTest } from "./api/api.test"

function App() {
    
    const [test, setTest] = useState("");

    useEffect(() => {
        getTest().then(data => setTest(data));
    }, []);

    return (
        <>
            {test}
            <div className="redDiv">
                red~
            </div>
        </>
    )

}

export default App
