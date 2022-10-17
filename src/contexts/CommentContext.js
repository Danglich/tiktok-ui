import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { createContext, useState } from 'react';
import useFirestore from '~/hooks/useFirestore';
import { apiUrl } from './constants';

export const CommentContext = createContext();

function CommentProvider({ children }) {
    const [videoCurrentId, setVideoCurrentId] = useState('');
    const [commentsInfo, setCommentsInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const conditionComment = useMemo(() => {
        return {
            fieldName: 'videoId',
            operator: '==',
            compareValue: videoCurrentId,
        };
    }, [videoCurrentId]);

    const comments = useFirestore('comments', conditionComment);

    const comments_ = useMemo(() => {
        setIsLoading(true);
        return Promise.all(
            comments.map(async (message) => {
                try {
                    const res = await axios.get(
                        `${apiUrl}/user/${message.userId}`,
                    );

                    const user = res.data.user;
                    return { ...message, user: user };
                } catch (error) {
                    throw error;
                }
            }),
        );
    }, [comments]);

    useEffect(() => {
        comments_.then((messages) => {
            setCommentsInfo(messages);
            setIsLoading(false);
        });
    }, [comments_]);

    return (
        <CommentContext.Provider
            value={{
                isLoading,
                commentsInfo,
                videoCurrentId,
                setVideoCurrentId,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
}

export default CommentProvider;
