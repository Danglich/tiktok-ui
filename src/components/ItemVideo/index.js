import {
    faFontAwesome,
    faPause,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './ItemVideo.module.scss';
import { useRef, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import VisibilitySensor from 'react-visibility-sensor';

import { Loading } from '~/components/Icons';
import Action from '../Action';
import FollowButton from '../FollowButton';
import { AuthContext } from '~/contexts/AuthContext';
import Button from '../Button';
import ModalAuth from '../ModalAuth';
import useModal from '~/hooks/useModal';
import { Link } from 'react-router-dom';
import Volume from '../Volume';

const cx = classNames.bind(styles);

function ItemVideo({ data, hidenFollow, location, videosId }) {
    const { isShowing, toggle } = useModal();
    const user = data.user;
    const { authState } = useContext(AuthContext);
    const { isAuthenticated } = authState;

    const volume = useSelector((state) => state.volume);

    const videoRef = useRef();
    const timeRef = useRef();

    const [playing, setPlaying] = useState(false);
    const [isCanPlay, setIsCanPlay] = useState(false);

    useEffect(() => {
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, []);

    //Xử lí nút Play
    useEffect(() => {
        if (playing) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [playing]);

    //Khi video hiện tại hết

    const handleWindowBlur = () => {
        setPlaying(false);
    };

    const handlePlayVideo = () => {
        setPlaying(!playing);
    };

    const handleVideoInView = (isVisible) => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
        setPlaying(isVisible);
    };

    //Âm thanh
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    const handleClickDetailVideo = (e) => {
        e.target.pause();
        setPlaying(false);
    };

    return (
        <div className={cx('wrapper')}>
            <Link to={`/@${user.nickname}`} className={cx('avatar')}>
                <img src={user.avatar} alt="avatar" />
            </Link>
            <div className={cx('content')}>
                <div className={cx('info')}>
                    <div>
                        <Link
                            to={`/@${user.nickname}`}
                            className={cx('username')}
                        >
                            {user.nickname}
                        </Link>
                        <span className={cx('author')}>{user.fullname}</span>
                        <p className={cx('title')}>{data.title}</p>
                    </div>

                    {!hidenFollow ? (
                        <>
                            {isAuthenticated ? (
                                <FollowButton
                                    userid={user._id}
                                    nickname={user.nickname}
                                    classNameOther={cx('btn-follow')}
                                    outline
                                ></FollowButton>
                            ) : (
                                <>
                                    <Button
                                        outline
                                        size={'small'}
                                        classNameOther={cx('btn-follow')}
                                        onClick={toggle}
                                    >
                                        Follow
                                    </Button>
                                    <ModalAuth
                                        isShowing={isShowing}
                                        toggle={toggle}
                                    />
                                </>
                            )}
                        </>
                    ) : null}
                </div>
                <div className={cx('body')}>
                    <div className={cx('wrapper-item')}>
                        {!isCanPlay && (
                            <div className={cx('box-load')}>
                                {/* <div className={cx('load')}></div> */}
                                <Loading />
                            </div>
                        )}
                        <div className={cx('video-wrapper')}>
                            <VisibilitySensor
                                partialVisibility={true}
                                minTopValue={300}
                                offset={{ top: 320 }}
                                scrollDelay={0}
                                onChange={(isVisible) => {
                                    handleVideoInView(isVisible);
                                }}
                            >
                                <Link
                                    to={`/@${user.nickname}/video/${data._id}`}
                                    className={cx('link_video')}
                                    state={{
                                        background: location,
                                        listVideos: videosId,
                                    }}
                                >
                                    <video
                                        playsInline
                                        autoPlay
                                        loop={true}
                                        ref={videoRef}
                                        onClick={(e) => {
                                            handleClickDetailVideo(e);
                                        }}
                                        onLoadedData={(e) => {
                                            e.target.volume = volume;
                                            setIsCanPlay(true);
                                        }}
                                        onPause={() => {
                                            setPlaying(false);
                                        }}
                                        onPlay={() => {
                                            setPlaying(true);
                                        }}
                                        muted={!isCanPlay && 'muted'}
                                    >
                                        <source
                                            src={data.url}
                                            type="video/mp4"
                                        />
                                    </video>
                                </Link>
                            </VisibilitySensor>
                            <p className={cx('report')}>
                                <FontAwesomeIcon icon={faFontAwesome} />
                                Báo cáo
                            </p>
                            <button
                                onClick={handlePlayVideo}
                                className={cx('control')}
                            >
                                <FontAwesomeIcon
                                    icon={playing ? faPause : faPlay}
                                />
                            </button>
                            <div className={cx('control-volume')}>
                                {/* <div className={cx('volume-wrapper')}>
                                    <div
                                        onClick={(e) => handleSetVolume(e)}
                                        className={cx('volume-total')}
                                    ></div>
                                    <div
                                        ref={volumeCircleRef}
                                        draggable
                                        onDragOver={(e) => handleAllowDrop(e)}
                                        onDrag={(e) => handleSetVolumeByDrag(e)}
                                        className={cx('volume-circle')}
                                    ></div>
                                    <div
                                        ref={volumeRef}
                                        className={cx('volume-current')}
                                    ></div>
                                </div>
                                <button
                                    onClick={handleSetMute}
                                    className={cx('volume-icon')}
                                >
                                    {isMute ? (
                                        <FontAwesomeIcon
                                            className={cx('volume-icon-mute')}
                                            icon={faVolumeMute}
                                        />
                                    ) : (
                                        <SoundIcon />
                                    )}
                                </button> */}
                                <Volume />
                            </div>
                            <div className={cx('control-time')}>
                                <div className={cx('crossbar-time')}>
                                    <div
                                        ref={timeRef}
                                        className={cx('crossbar-time-current')}
                                    ></div>
                                </div>
                                <div className={cx('time')}>00:01/00:50</div>
                            </div>
                        </div>
                    </div>
                    <Action data={data} />
                </div>
            </div>
        </div>
    );
}

export default ItemVideo;
