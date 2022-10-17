import classNames from 'classnames/bind';
import { useContext, useEffect } from 'react';
import { LikeComponentIcon, LikedCommentIcon } from '~/components/Icons';
import { AuthContext } from '~/contexts/AuthContext';
import styles from './Comment.module.scss';
import { formatRelative } from 'date-fns/esm';
import { useMemo } from 'react';
import useFirestore from '~/hooks/useFirestore';
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '~/contexts/constants';
import { Link } from 'react-router-dom';
import { deleteDocuments, updateDocument } from '~/firebase/services';
import useModal from '~/hooks/useModal';
import ModalAuth from '~/components/ModalAuth';

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

function Comment({
    comment,
    isSubComment,
    handleRepComment,
    authorId,
    isModal = false,
}) {
    const { isShowing, toggle } = useModal();
    const { authState } = useContext(AuthContext);
    const user = authState.user;

    const [viewMore, setViewMore] = useState(false);

    const [subcommentsInfo, setSubcommentsInfo] = useState([]);

    const isLiked = useMemo(() => {
        return comment?.likes.includes(user?._id);
    }, [comment?.likes, user]);

    const conditionSubComment = useMemo(() => {
        return {
            fieldName: 'commentParrentId',
            operator: '==',
            compareValue: comment.id,
        };
    }, [comment.id]);

    const subcomments = useFirestore('subcomments', conditionSubComment);

    const subcomments_ = useMemo(() => {
        return Promise.all(
            subcomments.map(async (comment) => {
                try {
                    const res = await axios.get(
                        `${apiUrl}/user/${comment.userId}`,
                    );

                    const user = res.data.user;
                    return { ...comment, user: user };
                } catch (error) {
                    throw error;
                }
            }),
        );
    }, [subcomments]);

    useEffect(() => {
        subcomments_.then((comments) => {
            setSubcommentsInfo(comments);
        });
    }, [subcomments_]);

    const handleViewMore = () => {
        setViewMore(true);
    };

    const handleHideAway = () => {
        setViewMore(false);
    };

    const handleLiked = () => {
        if (isLiked) {
            updateDocument(
                comment?.commentParrentId ? 'subcomments' : 'comments',
                comment?.id,
                {
                    likes: [
                        ...comment?.likes.filter(
                            (userId) => userId !== user?._id,
                        ),
                    ],
                },
            );
        } else {
            updateDocument(
                comment?.commentParrentId ? 'subcomments' : 'comments',
                comment?.id,
                {
                    likes: [...comment?.likes, user?._id],
                },
            );
        }
    };

    const handleDelete = () => {
        deleteDocuments(isSubComment ? 'subcomments' : 'comments', {
            id: comment?.id,
        });
    };
    return (
        <div className={cx('container', viewMore ? 'open_view_more' : '')}>
            <div className={cx('wrapper')}>
                <div
                    className={cx('avatar', isSubComment ? 'subcomment' : '')}
                    style={{ backgroundImage: `url(${comment?.user?.avatar})` }}
                ></div>
                <div className={cx('box_right')}>
                    <Link
                        to={`/@${comment?.user?.nickname}`}
                        className={cx('fullname')}
                    >
                        {comment?.user?.fullname}
                    </Link>
                    {authorId === comment?.userId && (
                        <span className={cx('author')}> . Tác giả</span>
                    )}
                    <span className={cx('comment')}>{comment?.text}</span>
                    <div className={cx('sub_info')}>
                        <span className={cx('time')}>
                            {formatDate(comment?.createdAt?.seconds)}
                        </span>
                        <div
                            className={cx('likes')}
                            onClick={() => {
                                if (user) {
                                    handleLiked();
                                } else {
                                    toggle();
                                }
                            }}
                        >
                            {isLiked ? (
                                <LikedCommentIcon />
                            ) : (
                                <LikeComponentIcon />
                            )}
                            <span className={cx('likes_count')}>
                                {comment?.likes?.length}
                            </span>
                            <ModalAuth isShowing={isShowing} toggle={toggle} />
                        </div>
                        {isModal ? (
                            <div
                                className={cx('rep')}
                                onClick={() => {
                                    if (user) {
                                        handleRepComment(comment);
                                    } else {
                                        toggle();
                                    }
                                }}
                            >
                                Trả lời
                            </div>
                        ) : (
                            <a
                                href={'#input_comment'}
                                className={cx('rep')}
                                onClick={() => {
                                    if (user) {
                                        handleRepComment(comment);
                                    } else {
                                        toggle();
                                    }
                                }}
                            >
                                Trả lời
                            </a>
                        )}
                    </div>
                </div>
                <div className={cx('more')}>
                    <FontAwesomeIcon icon={faEllipsis} />
                    <div className={cx('option')}>
                        {comment?.user?._id === user?._id ? (
                            <div
                                className={cx('delete')}
                                onClick={handleDelete}
                            >
                                Xóa
                            </div>
                        ) : (
                            <div className={cx('report')}>Báo cáo</div>
                        )}
                    </div>
                </div>
            </div>
            {subcomments?.length > 0 && (
                <>
                    <div className={cx('view_more')} onClick={handleViewMore}>
                        Xem thêm câu trả lời khác (
                        <span>{subcomments?.length}</span>)
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    <div className={cx('subcomments')}>
                        {subcommentsInfo.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                isSubComment={true}
                                authorId={authorId}
                                handleRepComment={handleRepComment}
                                isModal={isModal}
                            />
                        ))}
                    </div>
                    <div className={cx('hide')} onClick={handleHideAway}>
                        Ẩn bớt
                    </div>
                </>
            )}
        </div>
    );
}

export default memo(Comment);
