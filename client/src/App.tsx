import React, {useEffect, useState} from 'react';
import {AddTask} from "./components/Forms/AddTask";
import {Tasks} from "./components/Tasks";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login";

export interface ITask {
    id: string;
    title: string;
    description: string
    completed: boolean
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("user")
    );
    const [tasks, setTasks] = useState<ITask[]>([])

    useEffect(() => {
        const user = localStorage.getItem("user")

        axios.get('http://localhost:5000/tasks').then(resp => {
            const groupTasks = resp.data.filter((item: {
                group: number
            }) => item.group === +JSON.parse(user as string).group)
            setTasks(groupTasks)
        }).catch(error => {
            console.log(error)
        })

        const handleStorage = () => {
            if (!user) {
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true)
            }
        }

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [])

    return !isLoggedIn ? (
        <Routes>
            <Route path="*" element={<Login/>}/>
        </Routes>
    ) : (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="h-screen flex flex-col md:flex-row overflow-hidden">
                <AddTask tasks={tasks} setTasks={setTasks}/>
                <Tasks tasks={tasks} setTasks={setTasks}/>
            </div>
        </div>
    );
}

export default App;
