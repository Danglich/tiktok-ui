import classNames from 'classnames/bind';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Emoji from '~/components/Emoji';
import { AuthContext } from '~/contexts/AuthContext';
import { addDocument } from '~/firebase/services';
import styles from './InputComment.module.scss';

const cx = classNames.bind(styles);

function InputComment({
    commentRep,
    videoId,
    handleRepComment,
    hideAvatar = false,
}) {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const [text, setText] = useState('');

    const inputRef = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [commentRep]);

    const handleComment = () => {
        if (!commentRep) {
            addDocument('comments', {
                videoId: videoId,
                text: text.trim(),
                userId: user?._id,
                likes: [],
            });
        } else {
            addDocument('subcomments', {
                commentParrentId: commentRep?.commentParrentId
                    ? commentRep?.commentParrentId
                    : commentRep.id,
                text: text.trim(),
                userId: user?._id,
                likes: [],
            });
        }

        handleRepComment();

        setText('');
    };

    const handleSelectEmoji = useCallback((emoji) => {
        setText((prev) => prev + emoji);
    }, []);
    return (
        <div id={'#input_comment'} className={cx('wrapper')}>
            <div
                className={cx('avatar', hideAvatar ? 'hide' : '')}
                style={{ backgroundImage: `url(${user?.avatar})` }}
            ></div>
            <input
                ref={inputRef}
                className={cx('input')}
                type="text"
                placeholder={
                    commentRep
                        ? `Trả lời @${commentRep?.user?.nickname}`
                        : 'Thêm bình luận...'
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (!text && e.keyCode === 8) {
                        handleRepComment();
                    }
                    if (text.trim() && text.length <= 100 && e.keyCode === 13) {
                        handleComment();
                    }
                }}
            ></input>
            <div className={cx('emoji-container')}>
                <Emoji handleSelectEmoji={handleSelectEmoji} />
            </div>
            <div
                className={cx(
                    'btn',
                    (!text.trim() || text.length > 100) && 'disabled',
                )}
                onClick={() => {
                    if (text.trim() && text.length <= 100) {
                        handleComment();
                    }
                }}
            >
                Đăng
            </div>
        </div>
    );
}

export default InputComment;
