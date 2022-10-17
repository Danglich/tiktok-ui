import classNames from 'classnames/bind';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TriangleIcon } from '~/components/Icons';
import styles from './VideoItem.module.scss';

const cx = classNames.bind(styles);

function VideoItem({ data, location, videosId }) {
    const author = data.user;

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
        <div className={cx('container')}>
            <Link
                to={`/@${author.nickname}/video/${data._id}`}
                state={{
                    background: location,
                    listVideos: videosId,
                }}
            >
                <div className={cx('video_item--wrapper')}>
                    <video
                        ref={videoRef}
                        className={cx('video_item')}
                        muted={true}
                    >
                        <source src={data.url} type="video/mp4" />
                    </video>
                </div>
                <span className={cx('desc')}>{data.title}</span>
                <div className={cx('info')}>
                    <div className={cx('author')}>
                        <div
                            className={cx('avatar')}
                            style={{
                                backgroundImage: `url(${author.avatar})`,
                            }}
                        ></div>
                        <span className={cx('nickname')}>
                            {author.nickname}
                        </span>
                    </div>
                    <div className={cx('likes')}>
                        <TriangleIcon />
                        <strong>{data.likesCount}</strong>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default VideoItem;
