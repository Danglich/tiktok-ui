import { faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import LikeButton from '../LikeButton';
import Menu from '../Popper/Menu';
import styles from './Action.module.scss';
import {
    CopyLinkIcon,
    EmbedIcon,
    FacebookIcon,
    ShareIcon,
    TwitterIcon,
} from './icons';
import Button from '../Button';
import { useMemo } from 'react';
import useFirestore from '~/hooks/useFirestore';

const cx = classNames.bind(styles);

function Action({ data }) {
    const [state, setState] = useState({
        likes: data.likesCount,
        comments: data.commentsCount,
        shares: data.sharesCount,
    });

    const handleClickHeart = (likesCurrent) => {
        setState({ ...state, likes: likesCurrent });
    };

    useEffect(() => {
        setState({
            likes: data.likesCount,
            comments: data.commentsCount,
            shares: data.sharesCount,
        });
    }, [data]);
    const LIST_SHARES = [
        {
            title: 'Nhúng',
            iconSvg: <EmbedIcon />,
        },
        {
            title: 'Gửi đến bạn bè',
            iconSvg: <ShareIcon />,
        },
        {
            title: 'Chia sẻ với Facebook',
            iconSvg: <FacebookIcon />,
        },
        {
            title: 'Sao chép liên kết',
            iconSvg: <CopyLinkIcon />,
        },
        {
            title: 'Chia sẻ với Twitter',
            iconSvg: <TwitterIcon />,
        },
    ];
    const { authState } = useContext(AuthContext);
    const user = authState.user;

    const [isLiked, setIsLiked] = useState(null);

    const conditionComments = useMemo(() => {
        return {
            fieldName: 'videoId',
            operator: '==',
            compareValue: data._id,
        };
    }, [data._id]);

    const comments = useFirestore('comments', conditionComments);

    useEffect(() => {
        if (user) {
            setIsLiked(user.videosLiked.includes(data._id));
        }
    }, [user, data]);

    return (
        <div className={cx('wrapper')}>
            <div key={isLiked} className={cx('action-wrapper')}>
                <LikeButton
                    onClickHeart={handleClickHeart}
                    isLiked={isLiked}
                    videoId={data._id}
                />
                <span className={cx('quantity')}>{state.likes}</span>
            </div>
            <div className={cx('action-wrapper')}>
                <Button to={`/@${data.user.nickname}/video/${data._id}`}>
                    <div className={cx('icon-wrapper')}>
                        <FontAwesomeIcon
                            className={cx('icon')}
                            icon={faCommentDots}
                        />
                    </div>
                </Button>
                <span className={cx('quantity')}>{comments?.length}</span>
            </div>

            <Menu items={LIST_SHARES} offset={[0, 0]}>
                <div className={cx('action-wrapper')}>
                    <div className={cx('icon-wrapper')}>
                        <FontAwesomeIcon
                            className={cx('icon')}
                            icon={faShare}
                        />
                    </div>
                    <span className={cx('quantity')}>{state.shares}</span>
                </div>
            </Menu>
        </div>
    );
}

export default Action;
