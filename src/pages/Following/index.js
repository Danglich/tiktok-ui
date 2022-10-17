import axios from 'axios';
import classNames from 'classnames/bind';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import GoToTop from '~/components/GoToTop';
import ItemVideo from '~/components/ItemVideo';
import { AuthContext } from '~/contexts/AuthContext';
import { apiUrl } from '~/contexts/constants';
import ItemFollowing from './components/ItemFollowing';
import styles from './Following.module.scss';
import { useLocation } from 'react-router-dom';
import Skeleton from '~/components/Skeleton';
import useLoading from '~/hooks/useLoading';
import { Loading } from '~/components/Icons';

const cx = classNames.bind(styles);

function Following() {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const [listUserSuggest, setListUserSuggest] = useState([]);
    const [isLoadingUserSuggest, setIsLoadingUserSuggest] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const location = useLocation();

    //fetch Api
    const urlApi = 'videos/following';

    const {
        isLoading: isLoadingVideo,
        videos: videosFollowing,
        hasMore,
    } = useLoading(user, urlApi, pageNumber);

    useEffect(() => {
        window.document.title = 'Đang follow | Tiktok';
    }, []);

    const observer = useRef();

    const lastVideoElementRef = useCallback(
        (node) => {
            if (isLoadingVideo) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        setPageNumber((prevPageNumber) => prevPageNumber + 1);
                    }
                },
                {
                    threshold: 1,
                },
            );
            if (node) observer.current.observe(node);
        },
        [isLoadingVideo, hasMore],
    );

    useEffect(() => {
        let isSubscribed = true;

        // const fetchVideoData = async () => {
        //     setIsLoading(true);
        //     //get video following
        //     const videos = await axios.get(`${apiUrl}/videos/following?page=2`);
        //     if (videos.data.length === 0) {
        //         fetchSuggestData();
        //     }
        //     if (videos.data.length > 0 && user && isSubscribed) {
        //         setIsLoading(false);
        //         setListVideos(videos.data);
        //     }
        // };

        //get user suggest
        const fetchSuggestData = async () => {
            setIsLoadingUserSuggest(true);
            const result = await axios.get(
                `${apiUrl}/user/suggest?nickname=${
                    user ? user.nickname : ''
                }&limit=10`,
            );

            if (result && isSubscribed) {
                setIsLoadingUserSuggest(false);
                setListUserSuggest(result.data);
            }
        };

        if (!user || videosFollowing.length === 0) {
            fetchSuggestData();
        }

        return () => (isSubscribed = false);
    }, [user]);

    const videosId = useMemo(() => {
        return videosFollowing.map((video) => ({
            _id: video._id,
            nickname: video.user.nickname,
        }));
    }, [videosFollowing]);

    return (
        <div className={cx('wrapper')}>
            {videosFollowing.length > 0 ? (
                <div className={cx('wrapper--has-video')}>
                    <>
                        {videosFollowing.map((videoItem, index) => {
                            if (videosFollowing.length === index + 1) {
                                return (
                                    <div
                                        ref={lastVideoElementRef}
                                        key={videoItem._id}
                                    >
                                        <ItemVideo
                                            key={videoItem._id}
                                            data={videoItem}
                                            hidenFollow={true}
                                            location={location}
                                            videosId={videosId}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={videoItem._id}>
                                        <ItemVideo
                                            key={videoItem._id}
                                            data={videoItem}
                                            hidenFollow={true}
                                            location={location}
                                            videosId={videosId}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </>
                    {isLoadingVideo && (
                        <div className={cx('loading-container')}>
                            <Loading />
                        </div>
                    )}
                </div>
            ) : (
                <div className={cx('urer_suggest--container')}>
                    {isLoadingUserSuggest ? (
                        <Skeleton type="box" count={9} />
                    ) : (
                        <>
                            {listUserSuggest.map((user) => (
                                <div
                                    key={user._id}
                                    className={cx('user_suggest--item')}
                                >
                                    <ItemFollowing userData={user} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            <GoToTop />
        </div>
    );
}

export default Following;
