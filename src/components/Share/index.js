import {
    faCommentDots,
    faHeart,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useRef } from 'react';
import Menu from '../Popper/Menu';
import styles from './Action.mudole.scss';
import {
    CopyLinkIcon,
    EmbedIcon,
    FacebookIcon,
    ShareIcon,
    TwitterIcon,
} from './icons';

const cx = classNames.bind(styles);

function Share() {
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
    return (
        <>
            <Menu items={LIST_SHARES} offset={[160, 10]}>
                <button className={cx('btn-action')}>
                    <div className={cx('icon-wrapper')}>
                        <FontAwesomeIcon
                            className={cx('icon')}
                            icon={faShare}
                        />
                    </div>
                    <span className={cx('quantity')}>140</span>
                </button>
            </Menu>
        </>
    );
}

export default Share;
