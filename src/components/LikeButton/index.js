import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { apiUrl } from '~/contexts/constants';
import useModal from '~/hooks/useModal';
import { HeartIcon } from '../Icons';
import ModalAuth from '../ModalAuth';
import styles from './LikeButton.module.scss';

const cx = classNames.bind(styles);
function LikeButton({ size = 'medium', videoId, isLiked, onClickHeart }) {
    const [isLike, setIsLike] = useState(isLiked);
    const { authState } = useContext(AuthContext);
    const user = authState.user;

    const { isShowing, toggle } = useModal();

    const handleToggle = () => {
        setIsLike(!isLike);
    };

    const handleLike = async () => {
        handleToggle();
        try {
            const response = await axios.put(
                `${apiUrl}/videos/like/${videoId}`,
            );
            const { likesCurrent } = response.data;
            onClickHeart(likesCurrent);
        } catch (error) {}
    };

    const className = cx('container', {
        [size]: size,
        active: isLike,
    });

    return (
        <>
            <button onClick={user ? handleLike : toggle} className={className}>
                <div className={cx('heart_icon')}>
                    <HeartIcon />
                </div>
            </button>
            {!user && <ModalAuth isShowing={isShowing} toggle={toggle} />}
        </>
    );
}

export default LikeButton;
