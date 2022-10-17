import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { apiUrl } from './constants';

export const UserContext = createContext();

function UserContextProvider({ children }) {
    const [followings, setFollowings] = useState([]);
    const [suggesters, setSuggesters] = useState([]);
    const [isLoadingFl, setIsLoadingFl] = useState(false);
    const [isLoadingSg, setIsLoadingSg] = useState(false);

    //const [isFollowed, setIsFollowed] = useState(false);

    const { authState } = useContext(AuthContext);
    const user = authState.user;

    useEffect(() => {
        const getFollowings = async () => {
            setIsLoadingFl(true);
            try {
                const result = await axios.get(`${apiUrl}/user/followings`);

                if (result) {
                    setFollowings(result.data);
                }
                setIsLoadingFl(false);
            } catch (error) {
                console.error(error);
            }
        };
        const getSuggester = async () => {
            setIsLoadingSg(true);
            try {
                const result = await axios.get(
                    `${apiUrl}/user/suggest?nickname=${
                        user ? user.nickname : ''
                    }&limit=10`,
                );
                if (result) {
                    setSuggesters(result.data);
                }
                setIsLoadingSg(false);
            } catch (error) {
                console.log(error);
            }
        };

        if (user) {
            getFollowings();
        }
        getSuggester();
    }, [user]);

    const contextData = { followings, suggesters, isLoadingFl, isLoadingSg };

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
