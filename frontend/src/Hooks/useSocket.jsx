import { useContext } from 'react';
import SocketContext from '../Contexts/SocketContext.jsx';

const useSocket = () => useContext(SocketContext);

export default useSocket;
