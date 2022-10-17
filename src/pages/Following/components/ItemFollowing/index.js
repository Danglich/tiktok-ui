import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import FollowButton from '~/components/FollowButton';
import ModalAuth from '~/components/ModalAuth';
import { AuthContext } from '~/contexts/AuthContext';
import { apiUrl } from '~/contexts/constants';
import useModal from '~/hooks/useModal';
import styles from './ItemFollowing.module.scss';

const cx = classNames.bind(styles);

function ItemFollowing({ userData }) {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const [video, setVideo] = useState();

    const videoRef = useRef();
    const wrapRef = useRef();

    const { isShowing, toggle } = useModal();

    //Fetch data
    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            const resultVideo = await axios.get(
                `${apiUrl}/videos/uploaded/${userData.nickname}?quantity=1`,
            );

            if (resultVideo.data && !didCancel) {
                setVideo(resultVideo.data);
            }
        };

        fetchData();

        return () => {
            didCancel = true;
        };
    }, [userData.nickname]);

    //handle play videoRef
    useEffect(() => {
        if (wrapRef.current) {
            wrapRef.current.addEventListener('mouseenter', () => {
                if (videoRef.current) {
                    videoRef.current.play();
                }
            });

            wrapRef.current.addEventListener('mouseleave', () => {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            });
        }
    }, []);
    return (
        <>
            <Link to={`/@${userData.nickname}`}>
                <div ref={wrapRef} className={cx('container')}>
                    {video && (
                        <video ref={videoRef} key={video.url} muted={true}>
                            <source src={video.url} type="video/mp4" />
                        </video>
                    )}

                    {!video && <div className={cx('no-video')}></div>}
                    <div className={cx('user')}>
                        <div
                            className={cx('avatar')}
                            style={{
                                backgroundImage: `url(${userData.avatar})`,
                            }}
                        ></div>
                        <span className={cx('fullname')}>
                            {userData.fullname}
                        </span>
                        <span className={cx('nickname')}>
                            {userData.nickname}
                        </span>
                        {user ? (
                            <FollowButton
                                classNameOther={cx('follow-btn')}
                                primary={true}
                                userid={userData._id}
                                nickname={userData.nickname}
                            />
                        ) : (
                            <>
                                <Button
                                    classNameOther={cx('follow-btn')}
                                    primary={true}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        toggle();
                                    }}
                                >
                                    Follow
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {!user && <ModalAuth isShowing={isShowing} toggle={toggle} />}
        </>
    );
}

export default ItemFollowing;
