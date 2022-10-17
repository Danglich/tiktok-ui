import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Empty from '~/components/Empty';
import GoToTop from '~/components/GoToTop';
import { NoUserIcon } from '~/components/Icons';
import Skeleton from '~/components/Skeleton';
import { apiUrl } from '~/contexts/constants';
import AccountItem from './components/AccountItem';
import VideoItem from './components/VideoItem';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const location = useLocation();
    const searchString = location.search.slice(3);

    const isAccountPage = location.pathname.includes('user');
    const isVideoPage = location.pathname.includes('video');
    const isHomePageSearch = !isAccountPage && !isVideoPage;
    const [isLoading, setIsLoading] = useState(true);
    const [listUsers, setListUsers] = useState([]);
    const [listVideos, setListVideos] = useState([]);

    useEffect(() => {
        document.title = `Tìm '${searchString}' trên TikTok | Tìm kiếm TikTok`;
    }, [searchString]);

    useEffect(() => {
        const fetchDataUser = async () => {
            try {
                setIsLoading(true);
                if (isAccountPage) {
                    const result = await axios.get(
                        `${apiUrl}/search/user?q=${searchString}&&type=more`,
                    );

                    setListUsers(result.data);
                }

                if (isVideoPage) {
                    const result = await axios.get(
                        `${apiUrl}/search/video?q=${searchString}&&type=more`,
                    );

                    setListVideos(result.data);
                }

                if (isHomePageSearch) {
                    const result = await axios.get(
                        `${apiUrl}/search?q=${searchString}&&type=less`,
                    );

                    if (result.data) {
                        setListUsers(result.data.users);
                        setListVideos(result.data.videos);
                    }
                }

                setIsLoading(false);
            } catch (error) {}
        };
        if (searchString) {
            fetchDataUser();
        }
    }, [searchString, isAccountPage, isHomePageSearch, isVideoPage]);

    //State sang trang detail video
    const videosId = useMemo(() => {
        return listVideos.map((video) => ({
            _id: video._id,
            nickname: video.user.nickname,
        }));
    }, [listVideos]);

    const outlineRef = useRef();
    let indexActive = 0;
    if (isAccountPage) {
        indexActive = 1;
    }
    if (isVideoPage) {
        indexActive = 2;
    }
    useEffect(() => {
        const filterElements = document.querySelectorAll(`.${cx('filter')}`);

        filterElements.forEach((element, index) => {
            element.addEventListener('mouseenter', () => {
                if (outlineRef.current) {
                    outlineRef.current.style.transform = `translateX(${
                        index * 120
                    }px)`;
                }
            });

            element.addEventListener('mouseleave', () => {
                if (outlineRef.current) {
                    outlineRef.current.style.transform = `translateX(${
                        indexActive * 120
                    }px)`;
                }
            });
        });
    }, [isAccountPage, isHomePageSearch, isVideoPage, indexActive]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <Link to={`/search?q=${searchString}`}>
                    <div className={cx('filter', { active: isHomePageSearch })}>
                        <span className={cx('title')}>Top</span>
                    </div>
                </Link>
                <Link to={`/search/user?q=${searchString}`}>
                    <div className={cx('filter', { active: isAccountPage })}>
                        <span className={cx('title')}>Tài khoản</span>
                    </div>
                </Link>
                <Link to={`/search/video?q=${searchString}`}>
                    <div className={cx('filter', { active: isVideoPage })}>
                        <span className={cx('title')}>Video</span>
                    </div>
                </Link>
                <div
                    ref={outlineRef}
                    className={cx('outline')}
                    style={{
                        transform: `translateX(${indexActive * 120}px)`,
                    }}
                ></div>
            </div>
            <div className={cx('content')}>
                {isHomePageSearch && (
                    <>
                        {isLoading && (
                            <>
                                <div className={cx('skeleton-user-wrapper')}>
                                    <Skeleton type={'user'} size={'large'} />
                                    <Skeleton type={'user'} size={'large'} />
                                    <Skeleton type={'user'} size={'large'} />
                                </div>
                                <div className={cx('skeleton-videos-wrapper')}>
                                    <Skeleton type={'box'} count={6} />
                                </div>
                            </>
                        )}

                        {listUsers.length === 0 && listVideos.length === 0 && (
                            <Empty
                                Icon={<NoUserIcon />}
                                title="Không có nội dung"
                                subtitle="Không có nội dung bạn tìm kiếm"
                            />
                        )}
                    </>
                )}
                {isAccountPage && listUsers.length === 0 && (
                    <Empty
                        Icon={<NoUserIcon />}
                        title="Không có nội dung"
                        subtitle="Không có tài khoản bạn tìm kiếm"
                    />
                )}

                {isVideoPage && listVideos.length === 0 && (
                    <Empty
                        Icon={<NoUserIcon />}
                        title="Không có nội dung"
                        subtitle="Không có nội dung video bạn tìm kiếm"
                    />
                )}

                {listUsers.length > 0 && !isVideoPage && (
                    <div className={cx('accounts')}>
                        {!isAccountPage && (
                            <>
                                <div className={cx('accounts_header')}>
                                    <span className={cx('accounts_title')}>
                                        Tài khoản
                                    </span>
                                    <Link to={`/search/user?q=${searchString}`}>
                                        <span className={cx('accounts_more')}>
                                            Xem thêm
                                            <FontAwesomeIcon
                                                className={cx(
                                                    'accounts_more_icon',
                                                )}
                                                icon={faAngleRight}
                                            />
                                        </span>
                                    </Link>
                                </div>
                            </>
                        )}

                        <>
                            {listUsers.map((item, index) => (
                                <AccountItem key={index} data={item} />
                            ))}
                        </>
                    </div>
                )}

                <div className={cx('skeleton-videos-wrapper')}>
                    {isLoading && <Skeleton type={'box'} count={6} />}
                </div>

                {listVideos.length > 0 && !isAccountPage && (
                    <div className={cx('videos')}>
                        {!isVideoPage && (
                            <div className={cx('videos_header')}>Video</div>
                        )}
                        <div className={cx('videos_wrapper')}>
                            <>
                                {listVideos.map((item, index) => (
                                    <VideoItem
                                        key={index}
                                        data={item}
                                        location={location}
                                        videosId={videosId}
                                    />
                                ))}
                            </>
                        </div>
                        {!isVideoPage && (
                            <Link to={`/search/video?q=${searchString}`}>
                                <div className={cx('videos_more')}>
                                    Xem thêm
                                </div>
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <GoToTop />
        </div>
    );
}

export default Search;
