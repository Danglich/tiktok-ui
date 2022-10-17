import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import ItemVideo from '~/components/ItemVideo';
import GoToTop from '~/components/GoToTop';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import useLoading from '~/hooks/useLoading';
import { Loading } from '~/components/Icons';
import Skeleton from '~/components/Skeleton';

const cx = classNames.bind(styles);

function Home() {
    const { authState } = useContext(AuthContext);
    //const isLoading = false;

    const user = authState.user;
    const location = useLocation();

    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        document.title = 'Tiktok - Make Your Day';
    }, []);

    //fetch Api
    const urlApi = 'videos/foryou';

    const { isLoading, videos, hasMore } = useLoading(user, urlApi, pageNumber);

    const observer = useRef();

    const lastVideoElementRef = useCallback(
        (node) => {
            if (isLoading) return;
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
        [isLoading, hasMore],
    );

    const videosId = useMemo(() => {
        return videos.map((video) => ({
            _id: video._id,
            nickname: video.user.nickname,
        }));
    }, [videos]);

    return (
        <div className={cx('wrapper')}>
            {isLoading && videos.length === 0 && (
                <Skeleton type="itemVideoLarge" />
            )}
            {videos.map((videoItem, index) => {
                if (videos.length === index + 1) {
                    return (
                        <div key={index} ref={lastVideoElementRef}>
                            <ItemVideo
                                data={videoItem}
                                location={location}
                                videosId={videosId}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div key={index}>
                            <ItemVideo
                                data={videoItem}
                                location={location}
                                videosId={videosId}
                            />
                        </div>
                    );
                }
            })}

            {isLoading && videos.length > 0 && (
                <div className={cx('loading-container')}>
                    {/* <div className={cx('spinner')}></div> */}
                    {/* <img
                        src={'https://freesvg.org/img/1544764567.png'}
                        alt={''}
                    ></img> */}

                    <Loading />
                </div>
            )}

            <GoToTop />
        </div>
    );
}

export default Home;
