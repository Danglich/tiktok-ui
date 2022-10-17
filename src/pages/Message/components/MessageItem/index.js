import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import styles from './MessageItem.module.scss';
import { formatRelative } from 'date-fns/esm';
import { MessageContext } from '~/contexts/MessageContext';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { deleteDocuments, updateDocument } from '~/firebase/services';
import { LikeIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
}

function MessageItem({ message }) {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const { selectedRoom } = useContext(MessageContext);

    const condition = useMemo(() => {
        return {
            id: message.id,
        };
    }, [message.id]);

    const handleDeleteMessage = () => {
        deleteDocuments('messages', condition);
    };

    const handleLike = () => {
        updateDocument('messages', message.id, {
            like: !message?.like,
        });
    };

    return (
        <div
            className={cx(
                'wrapper',
                message?.userId === user?._id ? 'message_of_me' : '',
            )}
        >
            <p className={cx('time')}>
                {formatDate(message?.createdAt?.seconds)}
            </p>
            <div className={cx('info')}>
                <Link
                    to={`/@${
                        message?.userId === user?._id
                            ? user?.nickname
                            : selectedRoom?.user?.nickname
                    }`}
                    className={cx('avatar')}
                    style={{
                        backgroundImage: `url(${
                            message?.userId === user?._id
                                ? user?.avatar
                                : selectedRoom?.user?.avatar
                        })`,
                    }}
                ></Link>
                <div className={cx('message')}>
                    <p className={cx('text')}>{message?.text}</p>
                </div>
                <div className={cx('more')}>
                    <div className={cx('more_icon')}>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </div>
                    <div className={cx('more_option')}>
                        {message?.userId === user?._id ? (
                            <div
                                className={cx('delete')}
                                onClick={handleDeleteMessage}
                            >
                                Xóa
                            </div>
                        ) : (
                            <div onClick={handleLike} className={cx('like')}>
                                {message?.like ? 'Bỏ thích' : 'Thích'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message?.like && (
                <div className={cx('like_wrapper')}>
                    <div className={cx('like_icon')}>
                        <LikeIcon />
                    </div>
                    <div
                        className={cx('img')}
                        style={{
                            backgroundImage: `url(${
                                message?.userId === user?._id
                                    ? selectedRoom?.user?.avatar
                                    : user?.avatar
                            })`,
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export default MessageItem;
