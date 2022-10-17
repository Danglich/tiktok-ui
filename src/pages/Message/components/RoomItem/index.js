import classNames from 'classnames/bind';
import styles from './RoomItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useContext, useMemo } from 'react';
import { MessageContext } from '~/contexts/MessageContext';
import { deleteDocuments } from '~/firebase/services';

const cx = classNames.bind(styles);

function RoomItem({ room, isOnlyAvatar }) {
    const { setSelectedRoomId, selectedRoomId } = useContext(MessageContext);

    const conditionRoom = useMemo(() => {
        return {
            id: room.id,
        };
    }, [room.id]);

    const conditionMessagesOfRoom = useMemo(() => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: room.id,
        };
    }, [room.id]);

    const handleDeleteRoom = () => {
        deleteDocuments('rooms', conditionRoom);
        deleteDocuments('messages', conditionMessagesOfRoom);
    };
    return (
        <div
            className={cx(
                'wrapper',
                selectedRoomId === room.id ? 'active' : '',
                isOnlyAvatar ? 'only-avatar' : '',
            )}
            onClick={() => setSelectedRoomId(room.id)}
        >
            <div
                className={cx('avatar')}
                style={{
                    backgroundImage: `url(${room?.user?.avatar})`,
                }}
            ></div>
            <div className={cx('info')}>
                <span className={cx('fullname')}>{room?.user?.fullname}</span>
                <div>
                    <span className={cx('new_message')}>
                        {room?.newMessage}
                    </span>
                </div>
            </div>
            <div className={cx('more')}>
                <div className={cx('more_icon')}>
                    <FontAwesomeIcon icon={faEllipsis} />
                </div>
                <div className={cx('more_option')}>
                    <div className={cx('delete')} onClick={handleDeleteRoom}>
                        Xóa
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomItem;
