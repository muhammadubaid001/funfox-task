import {ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd"
import swal from 'sweetalert';
import {ITask} from "../App";
import {useSocket} from "../utils/Socket";

export interface IProps {
    tasks: ITask[]
    setTasks: Dispatch<SetStateAction<ITask[]>>
}

export const Tasks: FC<IProps> = ({tasks, setTasks}) => {

    const socket = useSocket()

    const handleTaskAdded = useCallback((data: any) => {
        swal('Some added new task')
    }, [])

    useEffect(() => {
        socket.on("task-added", handleTaskAdded);
        return () => {
            socket.off("task-added", handleTaskAdded);
        };
    }, [handleTaskAdded, socket]);

    const handleDragEnd = (e: any) => {
        if (!e.destination) return;
        let tempData = Array.from(tasks);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        setTasks(tempData);
    };

    const handleCompleteTask = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        const temp = [...tasks]
        temp.forEach(item => {
            if (item.id === id) {
                item.completed = e.target.checked
            }
        })
        setTasks(temp)
    }

    const handleDeleteTask = (id: string) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover!",
            icon: "warning",
            buttons: ["Cancel", "Confirm"],
            dangerMode: true,
        }).then(confirm => {
            if (confirm) {
                const temp = [...tasks]
                const index = temp.findIndex(item => item.id === id)

                temp.splice(index, 1)
                setTasks(temp)

                swal("Task deleted successfully")
            }

        })
    }

    return (
        <div className="w-full p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="TASK">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-col gap-4"
                        >
                            {tasks.map((item, key) => (
                                <Draggable
                                    draggableId={item.id}
                                    index={key}
                                    key={item.id}
                                >
                                    {(provider) => (
                                        <div
                                            className="bg-white rounded-md shadow-md p-4"
                                            {...provider.draggableProps}
                                            {...provider.dragHandleProps}
                                            ref={provider.innerRef}
                                        >
                                            <div className="flex justify-between">
                                                <div className="flex gap-3">
                                                    <input type="checkbox"
                                                           onChange={(e) => handleCompleteTask(e, item.id)}
                                                           defaultChecked={item.completed} className="w-4"/>
                                                    <div>
                                                        <h1 className={`${item.completed ? 'line-through' : ''} text-gray-900 font-medium`}>{item.title}</h1>
                                                        <p className="text-gray-700 text-xs">{item.description}</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="text-red-600"
                                                        onClick={() => handleDeleteTask(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                         className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
