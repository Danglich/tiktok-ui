import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { SendIcon } from '~/components/Icons';
import { AuthContext } from '~/contexts/AuthContext';
import { MessageContext } from '~/contexts/MessageContext';
import { addDocument, updateDocument } from '~/firebase/services';
import styles from './Input.module.scss';
import firebase from '~/firebase/config';
import Emoji from '~/components/Emoji';
import { useCallback } from 'react';

const cx = classNames.bind(styles);

function Input() {
    const [message, setMessage] = useState('');
    const handleInput = (e) => {
        setMessage(e.target.value);
    };

    const { selectedRoomId } = useContext(MessageContext);
    const { authState } = useContext(AuthContext);
    const user = authState.user;

    const handleSendMessage = () => {
        addDocument('messages', {
            roomId: selectedRoomId,
            userId: user?._id,
            text: message,
            like: false,
        });
        updateDocument('rooms', selectedRoomId, {
            newMessage: message,
            updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setMessage('');
    };

    const handleSelectEmoji = useCallback((emoji) => {
        setMessage((prev) => prev + emoji);
    }, []);
    return (
        <form className={cx('wrapper')}>
            <div className={cx('input-wrapper')}>
                <textarea
                    type="text"
                    className={cx('input', message.length > 150 ? 'error' : '')}
                    placeholder="Gửi tin nhắn..."
                    onChange={handleInput}
                    value={message}
                    onKeyDown={(e) => {
                        if (
                            e.keyCode === 13 &&
                            message.trim().length > 0 &&
                            message.length <= 150
                        ) {
                            handleSendMessage();
                        }
                    }}
                ></textarea>
                <div className={cx('emoji-container')}>
                    <Emoji handleSelectEmoji={handleSelectEmoji} />
                </div>
            </div>

            {message.trim().length > 0 && message.length <= 150 && (
                <button
                    type="submit"
                    className={cx('send_icon')}
                    onClick={handleSendMessage}
                >
                    <SendIcon />
                </button>
            )}
        </form>
    );
}

export default Input;
