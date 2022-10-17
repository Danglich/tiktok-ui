import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronUp,
    faFontAwesome,
    faPlay,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    CloseIcon,
    CommentIcon,
    Loading,
    LogoCircle,
} from '~/components/Icons';
import { AuthContext } from '~/contexts/AuthContext';
import styles from './ModalDetailVideo.module.scss';

import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiUrl, domain } from '~/contexts/constants';
import { useMemo } from 'react';
import FollowButton from '~/components/FollowButton';
import LikeButton from '~/components/LikeButton';
import { formatTime } from '~/utils/formatTime';
import Delete from '../DetailVideo/components/Delete';
import Volume from '~/components/Volume';
import { CommentContext } from '~/contexts/CommentContext';
import Comment from '../DetailVideo/components/Comment';
import InputComment from '../DetailVideo/components/InputComment';
import useModal from '~/hooks/useModal';
import ModalAuth from '~/components/ModalAuth';
import Skeleton from '~/components/Skeleton';
import ModalLoading from '~/components/ModalLoading';
import { notify } from '~/utils/toast';

const cx = classNames.bind(styles);

function ModalDetailVideo() {
    const { isShowing, toggle } = useModal();

    const volume = useSelector((state) => state.volume);
    const navigate = useNavigate();
    const location = useLocation();
    const background = location.state.background;
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const { nickname, videoId } = useParams();
    const [videoData, setVideoData] = useState(null);
    const [notHaveVideo, setNotHaveVideo] = useState(false);
    const [currentLikes, setCurrentLikes] = useState();
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef();
    const urlRef = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [isCanPlay, setIsCanPlay] = useState(false);
    const [countBack, setCountBack] = useState(1);

    const defaultLayout = useMemo(() => {
        return document.querySelector('.DefaultLayout_app__uCgTt');
    }, []);

    useEffect(() => {
        if (defaultLayout) {
            defaultLayout.style.display = 'none';
        }

        return () => {
            if (defaultLayout) {
                defaultLayout.style.display = 'flex';
            }
        };
    }, [defaultLayout, videoId]);

    //Lấy dữ liệu comment
    const {
        commentsInfo,
        setVideoCurrentId,
        isLoading: isLoadingComments,
    } = useContext(CommentContext);

    useEffect(() => {
        setVideoCurrentId(videoId);
    }, [videoId, setVideoCurrentId]);

    //Hết lấy dữ liệu comment

    const isOfMe = useMemo(() => {
        if (user) {
            return user.nickname === nickname;
        }
    }, [user, nickname]);

    const [commentRep, setCommentRep] = useState();

    const handleRepComment = useCallback((comment) => {
        setCommentRep(comment);
    }, []);

    //Âm thanh
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume, isCanPlay]);

    //Xử lí thanh thời gian

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const currentTimeRef = useRef();
    const circleRef = useRef();
    const [durationX, setDurationX] = useState();
    const [durationWidth, setDurationWidth] = useState();

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

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener(
                    'timeupdate',
                    handleTimeUpdate,
                );
            }
        };
    }, [videoRef, duration]);

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

        return () => {
            if (circleRef.current) {
                circleRef.current.removeEventListener('drag', handleDrag);
                circleRef.current.removeEventListener('dragend', handleDragend);
            }
        };
    }, [circleRef, duration, durationX, durationWidth]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    //Sao chép url
    const handleCopyUrl = () => {
        if (urlRef.current) {
            navigator.clipboard.writeText(urlRef.current.value);
            notify('Đã sao chép! 👍', 'success');
        }
    };

    const handleClickHeart = (likesCurrent) => {
        setCurrentLikes(likesCurrent);
    };

    //Thời gian video
    const time = useMemo(() => {
        if (videoData) {
            return videoData.createdAt.slice(0, 10);
        }
    }, [videoData]);

    //like
    const isLiked = useMemo(() => {
        if (user && videoData) {
            return user.videosLiked.includes(videoData._id);
        }
    }, [user, videoData]);

    //Gọi API lấy dữ liệu video
    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await axios.post(`${apiUrl}/videos/${videoId}`);
                if (result && isSubscribed) {
                    setVideoData(result.data);
                    setNotHaveVideo(false);
                    setCurrentLikes(result.data.likesCount);
                }
                setIsLoading(false);
            } catch (error) {
                //Không có video có id trên
                setIsLoading(false);

                if (error.response.data) {
                    setNotHaveVideo(true);
                }
            }
        };
        fetchData();

        return () => (isSubscribed = false);
    }, [videoId]);

    //Video tiếp theo/trước đó
    const videosId = useMemo(() => {
        return location?.state?.listVideos || [];
    }, [location]);

    const nextVideo = useMemo(() => {
        const prevIndex = videosId.findIndex((v) => v._id === videoId);
        return videosId[prevIndex + 1];
    }, [videosId, videoId]);

    const prevVideo = useMemo(() => {
        const prevIndex = videosId.findIndex((v) => v._id === videoId);
        return videosId[prevIndex - 1];
    }, [videosId, videoId]);

    if (isLoading && countBack === 1) {
        return <ModalLoading />;
    }

    if (notHaveVideo) {
        return <h1>Không tìm thấy video</h1>;
    }

    if (!notHaveVideo && videoData) {
        return (
            !notHaveVideo &&
            videoData && (
                <div className={cx('container')}>
                    <div className={cx('video_container')}>
                        <div
                            className={cx('video_wrapper')}
                            onClick={() => {
                                setIsPlaying(!isPlaying);
                            }}
                        >
                            {!isCanPlay && (
                                <div className={cx('video-loading-wrapper')}>
                                    <Loading />
                                </div>
                            )}
                            <video
                                key={videoData._id}
                                autoPlay={true}
                                ref={videoRef}
                                onDurationChange={() => {
                                    setDuration(videoRef.current.duration);
                                }}
                                onCanPlay={(e) => {
                                    e.target.volume = volume;
                                    setIsCanPlay(true);
                                }}
                                loop={true}
                                onPause={() => {
                                    setIsPlaying(false);
                                }}
                                onPlay={() => {
                                    setIsPlaying(true);
                                }}
                            >
                                <source src={videoData.url} />
                            </video>
                            <div className={cx('time')}>
                                <div
                                    ref={durationRef}
                                    className={cx('time_bar')}
                                >
                                    <div
                                        ref={currentTimeRef}
                                        className={cx('current_time')}
                                    ></div>
                                    <div
                                        ref={circleRef}
                                        className={cx('circle')}
                                    ></div>
                                </div>
                                <div className={cx('time_info')}>
                                    <span className={cx('current')}>
                                        {formatTime(currentTime)}
                                    </span>
                                    <span>/</span>
                                    <span className={cx('duration')}>
                                        {formatTime(duration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className={cx('close_btn')}
                            onClick={() => {
                                navigate(-countBack);
                            }}
                        >
                            <CloseIcon />
                        </div>
                        <div className={cx('logo')}>
                            <LogoCircle />
                        </div>
                        <div className={cx('report')}>
                            <FontAwesomeIcon icon={faFontAwesome} />
                            Báo cáo
                        </div>
                        <div className={cx('volume')}>
                            <Volume size={'sizeLeft'} />
                        </div>
                        {!isPlaying && (
                            <div
                                className={cx('play-btn')}
                                onClick={() => {
                                    setIsPlaying(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlay} />
                            </div>
                        )}
                        <div className={cx('next-container')}>
                            {prevVideo && (
                                <Link
                                    to={`/@${prevVideo?.nickname}/video/${prevVideo?._id}`}
                                    className={cx('link_video')}
                                    state={{
                                        background: background,
                                        listVideos: videosId,
                                    }}
                                    onClick={() => {
                                        setCountBack((prev) => prev + 1);
                                    }}
                                >
                                    <div className={cx('prev-btn')}>
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </div>
                                </Link>
                            )}

                            {nextVideo && (
                                <Link
                                    to={`/@${nextVideo?.nickname}/video/${nextVideo?._id}`}
                                    className={cx('link_video')}
                                    state={{
                                        background: background,
                                        listVideos: videosId,
                                    }}
                                    onClick={() => {
                                        setCountBack((prev) => prev + 1);
                                    }}
                                >
                                    <div className={cx('next-btn')}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={cx('block_right')}>
                        <div className={cx('info')}>
                            <div className={cx('author')}>
                                <Link
                                    to={`/@${videoData?.user?.nickname}`}
                                    className={cx('author_info')}
                                >
                                    <div
                                        className={cx('avatar')}
                                        style={{
                                            backgroundImage: `url(${videoData.user.avatar})`,
                                        }}
                                    ></div>
                                    <div className={cx('author_subinfo')}>
                                        <span className={cx('nickname')}>
                                            {videoData.user.nickname}
                                        </span>
                                        <span className={cx('username')}>
                                            {videoData.user.fullname} .{' '}
                                        </span>
                                        <span className={cx('time')}>
                                            {time}
                                        </span>
                                    </div>
                                </Link>

                                {isOfMe ? (
                                    <Delete videoId={videoId} />
                                ) : (
                                    <FollowButton
                                        userid={videoData.user?._id}
                                        classNameOther={cx('follow_btn')}
                                        outline
                                        nickname={videoData.user?.nickname}
                                    />
                                )}
                            </div>
                            <p className={cx('desc')}>{videoData.title}</p>
                            <div className={cx('action')}>
                                <div className={cx('heart')}>
                                    {/* <div className={cx('heart_icon--wrapper')}>
                                        <HeartIcon />
                                    </div> */}
                                    <LikeButton
                                        size="small"
                                        videoId={videoData._id}
                                        isLiked={isLiked}
                                        onClickHeart={handleClickHeart}
                                    />
                                    <span className={cx('quantity_heart')}>
                                        {currentLikes || videoData.likesCount}
                                    </span>
                                </div>
                                <div className={cx('comment_quantity')}>
                                    <div
                                        className={cx('comment_icon--wrapper')}
                                    >
                                        <CommentIcon />
                                    </div>
                                    <span className={cx('quantity_comment')}>
                                        {commentsInfo?.length}
                                    </span>
                                </div>
                            </div>
                            <div className={cx('copy_link')}>
                                <input
                                    type="text"
                                    ref={urlRef}
                                    className={cx('link')}
                                    value={`${domain}${location.pathname}`}
                                    onChange={() => {}}
                                ></input>
                                <button
                                    onClick={handleCopyUrl}
                                    className={cx('copy_link--btn')}
                                >
                                    Sao chép liên kết
                                </button>
                            </div>
                        </div>
                        <div className={cx('comments')}>
                            {isLoadingComments ? (
                                <>
                                    <Skeleton type={'comment'} />
                                    <Skeleton type={'comment'} />

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
                                            isModal={true}
                                            handleRepComment={handleRepComment}
                                            authorId={videoData?.user?._id}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                        {user ? (
                            <div className={cx('input_comment')}>
                                <InputComment
                                    hideAvatar={true}
                                    commentRep={commentRep}
                                    videoId={videoId}
                                    handleRepComment={handleRepComment}
                                />
                            </div>
                        ) : (
                            <>
                                <span className={cx('login')} onClick={toggle}>
                                    Vui lòng đăng nhập để bình luận
                                </span>
                                <ModalAuth
                                    isShowing={isShowing}
                                    toggle={toggle}
                                />
                            </>
                        )}
                    </div>
                </div>
            )
        );
    }
}

export default ModalDetailVideo;
