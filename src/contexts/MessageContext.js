import { createContext, useEffect, useState } from 'react';
import useFirestore from '~/hooks/useFirestore';
import { useContext, useMemo } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import axios from 'axios';
import { apiUrl } from './constants';

export const MessageContext = createContext();

function MessageProvider({ children }) {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const userId = user?._id;
    const [roomsInfo, setRoomsInfo] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const conditionRoom = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: userId,
        };
    }, [userId]);

    const rooms = useFirestore('rooms', conditionRoom);

    const rooms_ = useMemo(() => {
        return Promise.all(
            rooms.map(async (room) => {
                try {
                    const res = await axios.get(
                        `${apiUrl}/user/${room.members.filter(
                            (member) => member !== userId,
                        )}`,
                    );

                    const user = res.data.user;
                    return { ...room, user: user };
                } catch (error) {
                    throw error;
                }
            }),
        );
    }, [rooms]);

    useEffect(() => {
        rooms_.then((rooms) => {
            setRoomsInfo(rooms);
        });
    }, [rooms_]);

    const selectedRoom = useMemo(() => {
        return roomsInfo.find((room) => room.id === selectedRoomId) || {};
    }, [roomsInfo, selectedRoomId]);

    return (
        <MessageContext.Provider
            value={{
                roomsInfo,
                selectedRoom,
                selectedRoomId,
                setSelectedRoomId,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}

export default MessageProvider;
