import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BackIcon, Loading } from '~/components/Icons';
import ItemVideo from './components/ItemVideo';
import { apiUrl } from '~/contexts/constants';
import styles from './DetailVideo.module.scss';
import { useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import FollowButton from '~/components/FollowButton';
import GoToTop from '~/components/GoToTop';
import { useMemo } from 'react';
import { formatTime } from '~/utils/formatTime';
import Delete from './components/Delete';
import Comment from './components/Comment';
import { CommentContext } from '~/contexts/CommentContext';
import ModalAuth from '~/components/ModalAuth';
import useModal from '~/hooks/useModal';
import InputComment from './components/InputComment';
import { useCallback } from 'react';
import ModalLoading from '~/components/ModalLoading';
import Skeleton from '~/components/Skeleton';
import useLoading from '~/hooks/useLoading';
import Volume from '~/components/Volume';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function DetailVideo() {
    const navigate = useNavigate();
    const { nickname, videoId } = useParams();
    const [video, setVideo] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef();
    const currentTimeRef = useRef();
    const circleRef = useRef();
    const [durationX, setDurationX] = useState();
    const [durationWidth, setDurationWidth] = useState();
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [videoDataLoaded, setVideoDataLoaded] = useState(false);
    const { authState } = useContext(AuthContext);
    const user = authState.user;

    const { isShowing, toggle } = useModal();
    const volume = useSelector((state) => state.volume);

    //Bình luận
    const [commentRep, setCommentRep] = useState();

    const handleRepComment = useCallback((comment) => {
        setCommentRep(comment);
    }, []);

    useEffect(() => {
        setCommentRep();
        setCurrentTime(0);
    }, [videoId]);
    // Phần comments
    const {
        commentsInfo,
        setVideoCurrentId,
        isLoading: isLoadingComment,
    } = useContext(CommentContext);

    useEffect(() => {
        setVideoCurrentId(video?._id);
    }, [video?._id]);

    const isOfMe = useMemo(() => {
        if (user) {
            return user.nickname === nickname;
        }
    }, [user, nickname]);

    //Document title
    useEffect(() => {
        document.title = video.title;
    }, [video]);

    //Âm thanh
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    //fetch Data
    useEffect(() => {
        let isCancle = false;
        const fetchData = async () => {
            // Gọi video
            try {
                setIsLoadingVideo(true);
                const video = await axios.post(`${apiUrl}/videos/${videoId}`);
                if (!isCancle) {
                    setVideo(video.data);
                }
                setIsLoadingVideo(false);
            } catch (error) {
                setIsLoadingVideo(false);
            }

            // Gọi video gợi ý
            // try {
            //     const videoSuggest = await axios.get(
            //         `${apiUrl}/videos/foryou?userId=${user ? user._id : ''}`,
            //     );

            //     if (!isCancle) {
            //         setVideoSuggest(videoSuggest.data);
            //     }
            // } catch (error) {
            // }
        };

        fetchData();

        return () => {
            isCancle = true;
        };
    }, [videoId, nickname]);

    //fetch videos suggest

    const urlApi = 'videos/foryou';
    const {
        isLoading: isLoadingSuggest,
        videos,
        hasMore,
    } = useLoading(user, urlApi, pageNumber);

    const observer = useRef();

    const lastVideoElementRef = useCallback(
        (node) => {
            if (isLoadingSuggest) return;
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
        [isLoadingSuggest, hasMore],
    );

    useEffect(() => {
        if (videoId) {
            if (!isPlaying) {
                setIsPlaying(true);
            }
            if (videoRef.current) {
                videoRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                });
            }
        }
    }, [videoId, videoRef]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current?.currentTime);
                currentTimeRef.current.style.width = `${
                    (videoRef.current.currentTime * 100) / duration
                }%`;
                circleRef.current.style.left = `calc(${
                    (videoRef.current.currentTime * 100) / duration
                }%)`;
            }
        };
        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }
    }, [videoRef, duration]);

    const durationRef = useCallback(
        (node) => {
            if (node) {
                const x = node.getBoundingClientRect().left;
                const width = node.getBoundingClientRect().width;
                setDurationX(x);
                setDurationWidth(width);
                node.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const clickX = e.clientX;
                    currentTimeRef.current.style.width = `${
                        ((clickX - x) * 100) / width
                    }%`;
                    circleRef.current.style.left = `calc(${
                        ((clickX - x) * 100) / width
                    }%)`;
                    videoRef.current.currentTime =
                        ((clickX - x) / width) * duration;

                    setCurrentTime(((clickX - x) / width) * duration);
                });
            }
        },
        [duration, window.innerWidth],
    );

    useEffect(() => {
        const handleDrag = (e) => {
            const dragX = e.clientX;

            currentTimeRef.current.style.width = `${
                ((dragX - durationX) * 100) / durationWidth
            }%`;
            circleRef.current.style.left = `calc(${
                ((dragX - durationX) * 100) / durationWidth
            }%)`;
            videoRef.current.currentTime =
                ((dragX - durationX) / durationWidth) * duration;

            setCurrentTime(((dragX - durationX) / durationWidth) * duration);
        };

        const handleDragend = (e) => {
            const dragX = e.clientX;
            currentTimeRef.current.style.width = `${
                ((dragX - durationX) * 100) / durationWidth
            }%`;
            circleRef.current.style.left = `${
                ((dragX - durationX) * 100) / durationWidth
            }%`;
            videoRef.current.currentTime =
                ((dragX - durationX) / durationWidth) * duration;

            setCurrentTime(((dragX - durationX) / durationWidth) * duration);
        };

        if (circleRef.current) {
            circleRef.current.addEventListener('dragend', handleDragend);
            circleRef.current.addEventListener('drag', handleDrag);
        }
    }, [circleRef, duration, durationX, durationWidth]);

    const onBack = () => {
        navigate('/', { replace: true });
    };

    const time = new Date(video.createdAt);

    if (isLoadingVideo) {
        return <ModalLoading />;
    }

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <BackIcon />
                <span onClick={onBack} className={cx('title')}>
                    Quay lại Dành cho bạn
                </span>
            </div>
            <div className={cx('body')}>
                {/* Content là phần về nội dung của video hiện tại */}
                <div className={cx('content')}>
                    <div className={cx('video_info')}>
                        <div
                            className={cx('video_wrapper')}
                            onClick={() => {
                                setIsPlaying(!isPlaying);
                            }}
                        >
                            {!videoDataLoaded && (
                                <div className={cx('video-unload')}>
                                    <Loading />
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                key={video.url}
                                autoPlay={true}
                                onDurationChange={() => {
                                    setDuration(videoRef.current.duration);
                                }}
                                loop={true}
                                onCanPlay={(e) => {
                                    e.target.volume = volume;
                                    setVideoDataLoaded(true);
                                    setIsPlaying(true);
                                }}
                                onPause={() => {
                                    setIsPlaying(false);
                                }}
                                onPlay={() => {
                                    setIsPlaying(true);
                                }}
                            >
                                <source src={video.url} type="video/mp4" />
                            </video>

                            <>
                                {!isPlaying && (
                                    <div className={cx('play_icon--large')}>
                                        <FontAwesomeIcon icon={faPlay} />
                                    </div>
                                )}
                            </>
                            <div
                                ref={durationRef}
                                className={cx('time_controll')}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <div
                                    ref={currentTimeRef}
                                    className={cx('current_time')}
                                ></div>
                            </div>
                            <div
                                ref={circleRef}
                                className={cx('circle')}
                                draggable="true"
                            ></div>
                            <div className={cx('time')}>
                                <div className={cx('play_icon--small')}>
                                    <FontAwesomeIcon
                                        icon={isPlaying ? faPause : faPlay}
                                    />
                                </div>
                                <span className={cx('current_time')}>
                                    {formatTime(currentTime)}
                                </span>
                                <span>/</span>
                                <span className={cx('duration')}>
                                    {duration ? formatTime(duration) : '00:00'}
                                </span>
                            </div>
                            <div
                                className={cx('volume')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Volume size={'sizeLeft'} />
                            </div>
                        </div>

                        <span className={cx('video_title')}>{video.title}</span>
                    </div>

                    {isLoadingVideo ? (
                        <Skeleton type="user" />
                    ) : (
                        <div className={cx('user')}>
                            <Link
                                to={`/@${video.user?.nickname}`}
                                className={cx('avatar')}
                                style={{
                                    backgroundImage: `url(${video.user?.avatar})`,
                                }}
                            ></Link>
                            <Link
                                to={`/@${video.user?.nickname}`}
                                className={cx('info')}
                            >
                                <span className={cx('nickname')}>
                                    {video.user?.nickname}
                                </span>
                                <span className={cx('fullname')}>
                                    {video.user?.fullname}
                                </span>
                                <span> . </span>
                                <span className={cx('time')}>
                                    {time.getMonth()}-{time.getDay()}
                                </span>
                            </Link>
                            {isOfMe ? (
                                <div className={cx('btn_follow')}>
                                    <Delete />
                                </div>
                            ) : (
                                <div className={cx('btn_follow')}>
                                    <FollowButton
                                        primary={true}
                                        userid={video.user?._id}
                                        nickname={video.user?.nickname}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className={cx('comment')}>
                        <div className={cx('header')}>
                            <span className={cx('total_comments')}>
                                {commentsInfo?.length}
                            </span>
                            <span className={cx('')}>bình luận</span>
                        </div>

                        {user ? (
                            <div className={cx('input_wrapper')}>
                                <InputComment
                                    commentRep={commentRep}
                                    videoId={videoId}
                                    handleRepComment={handleRepComment}
                                />
                            </div>
                        ) : (
                            <div className={cx('login_wrapper')}>
                                <div
                                    className={cx('img')}
                                    style={{
                                        backgroundImage: `url(https://laban.edu.vn/wp-content/uploads/2021/01/Profile_avatar_placeholder_large.png)`,
                                    }}
                                ></div>
                                <div
                                    onClick={toggle}
                                    className={cx('btn_login')}
                                >
                                    Đăng nhập để bình luận
                                </div>
                                <ModalAuth
                                    isShowing={isShowing}
                                    toggle={toggle}
                                />
                            </div>
                        )}

                        <div className={cx('content')}>
                            {isLoadingComment ? (
                                <>
                                    <Skeleton type={'comment'} />
                                    <Skeleton type={'comment'} />
                                    <Skeleton type={'comment'} />
                                </>
                            ) : (
                                <>
                                    {commentsInfo.map((comment) => (
                                        <Comment
                                            comment={comment}
                                            key={comment.id}
                                            handleRepComment={handleRepComment}
                                            authorId={video?.user?._id}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('suggest')}>
                    <span className={cx('title')}>Video được đề suất</span>
                    <div className={cx('content')}>
                        {isLoadingSuggest && videos.length === 0 && (
                            <Skeleton type="box" count={8} size="small" />
                        )}
                        <>
                            {videos.map((item, index) => {
                                if (videos.length === index + 1) {
                                    return (
                                        <Link
                                            to={`/@${item.user?.nickname}/video/${item._id}`}
                                            key={item._id}
                                            className={cx(
                                                'video_item--wrapper',
                                            )}
                                            ref={lastVideoElementRef}
                                        >
                                            <ItemVideo data={item} />
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <Link
                                            to={`/@${item.user?.nickname}/video/${item._id}`}
                                            key={item._id}
                                            className={cx(
                                                'video_item--wrapper',
                                            )}
                                        >
                                            <ItemVideo data={item} />
                                        </Link>
                                    );
                                }
                            })}
                        </>
                        {isLoadingSuggest && videos.length > 0 && (
                            <div className={cx('loading-video-suggest')}>
                                <Loading />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <GoToTop />
        </div>
    );
}

export default DetailVideo;
