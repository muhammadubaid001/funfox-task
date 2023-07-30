import {ChangeEvent, FC, SyntheticEvent, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import {IProps} from "../Tasks";
import {useSocket} from "../../utils/Socket";

export const AddTask: FC<IProps> = ({ tasks, setTasks}) => {
    const [state, setState] = useState({
        title: '',
        description: ''
    })
    const socket = useSocket()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setState({
            ...state,
            [name]: value
        })
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()

        if(!state.title || !state.description) return

        const temp = [...tasks]
        temp.unshift({id: uuidv4(), completed: false, ...state })

        setTasks(temp)
        setState({
            title: '',
            description: ''
        })

        const user = JSON.parse(localStorage.getItem('user') as string)

        socket.emit('new-task', {...state, group: user.group })
    }

    return (
        <div className=" md:block md:h-screen w-full md:w-96 bg-transparent md:bg-white shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 p-4">
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Title</label>
                        <input type="text" className={styles.input} value={state.title} name="title" onChange={handleChange} placeholder="Enter title" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Description</label>
                        <input type="text" className={styles.input} value={state.description} name="description" onChange={handleChange} placeholder="Enter description" required/>
                    </div>
                    <button className={styles.button}>Save</button>
                </div>
            </form>
        </div>
    )
}

export const styles = {
    inputContainer: '',
    input: 'border rounded-md p-2 w-full focus:outline-none focus:border-blue-400 text-gray-800 text-sm',
    label: 'text-sm font-medium tracking-wide text-gray-800',
    button: 'bg-blue-500 tracking-wide text-white p-2 rounded-md'
}
