import React, {ChangeEvent, SyntheticEvent, useState} from "react"
import {styles} from "../components/Forms/AddTask";

const Login = () => {
    const [state, setState] = useState({
        email: '',
        group: null
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setState({
            ...state,
            [name]: value
        })
    }

    const handleSubmit = (e: SyntheticEvent) =>  {
        e.preventDefault()

        localStorage.setItem('user', JSON.stringify(state))
        window.location.reload()
        window.dispatchEvent(new Event("storage"));
    }

    return (
        <div className={loginStyles.container}>
            <div className={loginStyles.banner}>
                <h2 className="mt-6 text-center text-3xl font-bold text-logo-blue">
                    Join Group
                </h2>
            </div>

            <div className={loginStyles.cardContainer}>
                <div className={loginStyles.card}>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                        <input
                            type="email"
                            onChange={handleChange}
                            placeholder="Email address"
                            className={styles.input}
                            name="email"
                        />

                        <input
                            type="number"
                            onChange={handleChange}
                            placeholder="Enter group number"
                            className={styles.input}
                            name="group"
                        />

                        <button
                            type="submit"
                            className={`bg-blue-400 hover:bg-logo-blue/50 w-full  p-2 rounded-md text-white bg-logo-blue hover:bg-logo-blue/90 focus:outline-none`}>
                          Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const loginStyles = {
    container:
        "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8",
    card: "bg-white py-10 px-4 shadow sm:rounded-lg sm:px-10",
    cardContainer: "mt-8 sm:mx-auto sm:w-full sm:max-w-md px-6 md:px-0",
    banner: "sm:mx-auto sm:w-full sm:max-w-md",
    logo: "mx-auto h-20 w-auto",
}

export default Login
