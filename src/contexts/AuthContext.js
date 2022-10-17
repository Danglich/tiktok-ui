import axios from 'axios';
import { useReducer, useEffect } from 'react';
import { createContext } from 'react';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants';
import authReducer from '~/reducers/authReducer';
import setAuthToken from '~/utils/setAuthToken';

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null,
    });

    const loadUser = async () => {
        const token = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME),
        );

        if (token) {
            setAuthToken(token);
        }
        try {
            const response = await axios.get(`${apiUrl}/auth`);
            if (response.data.success) {
                dispatch({
                    type: 'SET_AUTH',
                    payload: {
                        isAuthenticated: true,
                        user: response.data.user,
                    },
                });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthToken(null);
            dispatch({
                type: 'SET_AUTH',
                payload: { isAuthenticated: false, user: null },
            });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    //login
    const loginUser = async (loginForm) => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/login`,
                loginForm,
            );
            //Nếu mà login đúng thì lưu acess token vào localstorate
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    JSON.stringify(response.data.accessToken),
                );
            }

            //load lại user
            await loadUser();

            return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    };

    //Register
    const registerUser = async (registerForm) => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/register`,
                registerForm,
            );
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    JSON.stringify(response.data.accessToken),
                );
            }
            await loadUser();

            return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    };

    //Logout
    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        setAuthToken(null);
        dispatch({
            type: 'SET_AUTH',
            payload: { isAuthenticated: false, user: null },
        });
    };

    const contextData = { loginUser, registerUser, logoutUser, authState };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
