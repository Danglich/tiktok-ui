import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '~/contexts/constants';

export default function useLoading(user, url, pageNumber) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [videos, setVideos] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setVideos([]);
    }, [url]);

    useEffect(() => {
        let isSubscribed = true;
        setIsLoading(true);
        setError(false);
        const fetchData = async () => {
            try {
                const result = await axios.get(
                    `${apiUrl}/${url}?userId=${
                        user ? user._id : ''
                    }&page=${pageNumber}`,
                );

                if (isSubscribed && result) {
                    setIsLoading(false);
                    setVideos([...videos, ...result.data]);
                    setHasMore(result.data.length > 0);
                }
            } catch (error) {
                setError(true);
                setIsLoading(false);
            }
        };

        fetchData();

        return () => (isSubscribed = false);
    }, [user, pageNumber, url]);

    return { isLoading, error, videos, hasMore };
}
