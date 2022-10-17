import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SettingIcon } from '~/components/Icons';
import styles from './Message.module.scss';
import $ from 'jquery';
import useModal from '~/hooks/useModal';
import ModalSettingMessage from '~/components/ModalSettingMessage';
import { useContext } from 'react';
import { MessageContext } from '~/contexts/MessageContext';
import RoomItem from './components/RoomItem';
import MessageItem from './components/MessageItem';
import useFirestore from '~/hooks/useFirestore';
import Input from './components/Input';

const cx = classNames.bind(styles);
function Message() {
    const { isShowing, toggle } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        window.document.title = 'Tin nhắn | Tiktok';
    }, []);

    useEffect(() => {
        $('html, body').animate({ scrollTop: 0 }, 0);
    }, []);

    const onBack = () => {
        navigate(-1);
    };

    const { roomsInfo, selectedRoom, selectedRoomId } =
        useContext(MessageContext);

    const messageCondition = useMemo(() => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoomId,
        };
    }, [selectedRoomId]);

    const messages = useFirestore('messages', messageCondition);

    return (
        <div className={cx('container')}>
            <div className={cx('content')}>
                <div className={cx('user')}>
                    <div className={cx('header')}>
                        <span className={cx('title')}>Tin nhắn</span>
                        <div className={cx('setting_icon')} onClick={toggle}>
                            <SettingIcon />
                        </div>
                        <ModalSettingMessage
                            isShowing={isShowing}
                            toggle={toggle}
                        />
                    </div>
                    <div className={cx('room_wrapper')}>
                        {roomsInfo.map((room) => (
                            <RoomItem key={room.id} room={room} />
                        ))}
                    </div>
                    <div className={cx('room_wrapper--tablet')}>
                        {roomsInfo.map((room) => (
                            <RoomItem
                                key={room.id}
                                room={room}
                                isOnlyAvatar={true}
                            />
                        ))}
                    </div>
                </div>
                <div className={cx('message')}>
                    {selectedRoom?.id && (
                        <Link
                            to={`/@${selectedRoom?.user?.nickname}`}
                            className={cx('header')}
                        >
                            <div
                                className={cx('avatar')}
                                style={{
                                    backgroundImage: `url(${selectedRoom?.user?.avatar})`,
                                }}
                            ></div>
                            <div className={cx('user_info')}>
                                <p className={cx('fullname')}>
                                    {selectedRoom?.user?.fullname}
                                </p>
                                <p className={cx('nickname')}>
                                    {selectedRoom?.user?.nickname}
                                </p>
                            </div>
                        </Link>
                    )}
                    <div className={cx('content_message')}>
                        {messages.map((message) => (
                            <MessageItem key={message.id} message={message} />
                        ))}
                    </div>

                    {selectedRoom?.user && (
                        <div className={cx('input')}>
                            <Input />
                        </div>
                    )}
                </div>
            </div>
            <div onClick={onBack} className={cx('back_btn')}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        </div>
    );
}

export default Message;
