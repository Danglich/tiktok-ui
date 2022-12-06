import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import styles from './Header.module.scss';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Search from '../Search';
import images from '~/assets/images';

import {
    faPlus,
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faKeyboard,
    faSignOut,
    faCoins,
    faVideo,
    faUserLarge,
} from '@fortawesome/free-solid-svg-icons';

import { NotifyIcon, UploadIcon } from '~/components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '~/hooks/useModal';
import ModalAuth from '~/components/ModalAuth';
import { AuthContext } from '~/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { adminUrl } from '~/contexts/constants';

const cx = classNames.bind(styles);

function Header({ fullWidth = false }) {
    const { authState, logoutUser } = useContext(AuthContext);
    const [haveUser, setHaveUser] = useState(null);
    const { isShowing, toggle } = useModal();

    const user = authState.user;
    let navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setHaveUser(false);
        }
        if (user) {
            setHaveUser(true);
        }
    }, [user]);

    const logout = () => {
        logoutUser();
        navigate('/', { replace: true });
        window.location.reload();
    };

    const MENU_ITEMS = [
        {
            title: 'Tiếng Việt',
            icon: faEarthAsia,
            children: {
                title: 'Ngôn ngữ',
                data: [
                    {
                        title: 'Tiếng Việt',
                        code: 'vi',
                    },
                    {
                        title: 'English',
                        code: 'en',
                    },
                    {
                        title: 'Cebuano (Pilipinas)',
                        code: 'pil',
                    },
                ],
            },
        },
        {
            title: 'Phản hồi và trợ giúp',
            icon: faCircleQuestion,
            to: '',
        },
        {
            title: 'Phím tắt trên bàn phím',
            icon: faKeyboard,
        },
    ];
    const menuUserItems = [
        {
            title: 'Xem hồ sơ',
            icon: faUserLarge,
            to: user ? `/@${user.nickname}` : null,
        },
        {
            title: 'Nhận xu',
            icon: faCoins,
        },
        {
            title: 'LIVE Studio',
            icon: faVideo,
        },
        ...MENU_ITEMS,
        {
            title: 'Đăng suất',
            icon: faSignOut,
            seperate: true,
            onClick: logout,
        },
    ];

    if (haveUser === null) {
        return null;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content', { 'full-width': fullWidth })}>
                <Link to={'/'} className={cx('logo')}>
                    <div>
                        <img src={images.logo} alt="Tiktok" />
                    </div>
                </Link>
                {/* Search */}
                <Search />

                <div className={cx('action')}>
                    <Button
                        to={haveUser ? '/upload' : null}
                        onClick={(e) => {
                            if (!haveUser) {
                                e.preventDefault();
                                toggle();
                            }
                        }}
                        IconLeft={faPlus}
                        font={'thin'}
                        borderDefault
                    >
                        Tải lên
                    </Button>
                    {haveUser ? (
                        <>
                            <Tippy content="Tin nhắn">
                                <Link
                                    to="/messages"
                                    className={cx('user-action')}
                                >
                                    <UploadIcon />
                                </Link>
                            </Tippy>
                            <Tippy content="Hộp thư">
                                <button className={cx('user-action')}>
                                    <NotifyIcon />
                                </button>
                            </Tippy>
                            {user?.roleId === 1 && (
                                <a
                                    href={adminUrl || ''}
                                    className={cx('admin-link')}
                                >
                                    Admin
                                </a>
                            )}
                            <Menu items={user ? menuUserItems : MENU_ITEMS}>
                                <img
                                    className={cx('avatar')}
                                    src={user ? user.avatar : ''}
                                    alt={'Avatar'}
                                />
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button primary font={'thick'} onClick={toggle}>
                                Đăng nhập
                            </Button>
                            <Menu items={MENU_ITEMS}>
                                <button className={cx('more')}>
                                    <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                    />
                                </button>
                            </Menu>
                        </>
                    )}
                </div>
            </div>
            <ModalAuth isShowing={isShowing} toggle={toggle} />
        </div>
    );
}

export default Header;
