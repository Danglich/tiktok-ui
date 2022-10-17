import classNames from 'classnames/bind';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TriangleIcon } from '~/components/Icons';
import styles from './VideoItem.module.scss';

const cx = classNames.bind(styles);

function VideoItem({ video, user, location, videosId }) {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('mouseenter', () => {
                videoRef.current.play();
            });

            videoRef.current.addEventListener('mouseleave', () => {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            });
        }
    }, []);
    return (
        <div className={cx('wrapper')}>
            <Link
                to={`/@${user.nickname}/video/${video._id}`}
                state={{
                    background: location,
                    listVideos: videosId,
                }}
            >
                <div className={cx('video-wrap')}>
                    <video ref={videoRef} muted={true}>
                        <source src={video.url} type="video/mp4" />
                    </video>
                </div>
                <span className={cx('title')}>{video.title}</span>
                <div className={cx('likes')}>
                    <TriangleIcon />
                    <strong className={cx('quantity')}>
                        {video.likesCount}
                    </strong>
                </div>
            </Link>
        </div>
    );
}

export default VideoItem;
