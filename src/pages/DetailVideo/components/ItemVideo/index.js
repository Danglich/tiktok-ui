import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { formatTime } from '~/utils/formatTime';
import styles from './ItemVideo.module.scss';

const cx = classNames.bind(styles);

function ItemVideo({ data }) {
    const time = new Date(data.createdAt);
    const videoRef = useRef();
    const [duration, setDuration] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('mouseenter', () => {
                videoRef.current.play();
            });

            videoRef.current.addEventListener('mouseleave', () => {
                videoRef.current.currentTime = 0;
                videoRef.current.pause();
            });
        }
    }, [videoRef]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video_wrapper')}>
                {isLoading && (
                    <div className={cx('box-load')}>
                        <div className={cx('load')}></div>
                    </div>
                )}
                <video
                    ref={videoRef}
                    key={data.url}
                    muted={true}
                    loop={true}
                    onDurationChange={(e) => {
                        setDuration(e.target.duration);
                    }}
                    onCanPlay={() => {
                        setIsLoading(false);
                    }}
                >
                    <source src={data.url} type="video/mp4" />
                </video>
                <div className={cx('duration_wrapper')}>
                    <span className={cx('duration')}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
            <div className={cx('info')}>
                <span className={cx('title')}>{data.title}</span>
                <span className={cx('nickname')}>{data.user?.nickname}</span>
                <span className={cx('time')}>
                    {time.getDay()}-{time.getMonth()}
                </span>
                <div className={cx('likes_wrapper')}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span className={cx('likes_count')}>{data.likesCount}</span>
                </div>
            </div>
        </div>
    );
}

export default ItemVideo;
