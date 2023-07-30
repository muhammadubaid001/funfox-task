import React, {useMemo} from "react"
import io from "socket.io-client"

const SocketContext = React.createContext<any>(null);

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider = ({children}: any) => {
    const socket = useMemo(() => io("http://localhost:5001"), []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};
