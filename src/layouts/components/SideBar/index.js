import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '~/components/Button';
import { HomeIcon, GroudIcon, LiveIcon } from '~/components/Icons';
import SearchAccountItem from '~/components/SearchAccountItem';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import ModalAuth from '~/components/ModalAuth';
import useModal from '~/hooks/useModal';
import { UserContext } from '~/contexts/UserContext';
import { Link, useLocation } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Skeleton from '~/components/Skeleton';

const cx = classNames.bind(styles);
function SideBar({ small }) {
    const location = useLocation();
    const isFollowPage = location.pathname === '/following';
    const isHomePage = location.pathname === '/';
    const { isShowing, toggle } = useModal();
    const { authState } = useContext(AuthContext);
    const { isAuthenticated } = authState;

    const scrollTrackRef = useRef();
    const wrapperItems = useRef();

    const limitReduce = 3;
    const limitMore = 5;
    const [limit, setLimit] = useState({
        suggest: limitReduce,
        following: limitReduce,
    });

    const { followings, suggesters, isLoadingSg } = useContext(UserContext);

    const handleScroll = (e) => {
        const target = e.target;
        if (scrollTrackRef.current) {
            //266 chính là = Chiều dài của Nav - 100vh
            //722 là chiều dài của màn hình
            const scrollMax = wrapperItems.current.clientHeight - 722;
            scrollTrackRef.current.style.transform = `translateY(${
                (target.scrollTop / scrollMax) * 462
            }px)`;
        }
    };

    //Phần xem thêm và bỏ bớt
    const handleMore = (category) => {
        if (category === 'suggest') {
            setLimit({ ...limit, suggest: limitMore });
        }
        if (category === 'following') {
            setLimit({ ...limit, following: limitMore });
        }
    };
    const handleReduce = (category) => {
        if (category === 'suggest') {
            setLimit({ ...limit, suggest: limitReduce });
        }
        if (category === 'following') {
            setLimit({ ...limit, following: limitReduce });
        }
    };

    return (
        <div className={cx('content', { small: small })}>
            <div onScroll={(e) => handleScroll(e)} className={cx('body')}>
                <div ref={wrapperItems}>
                    <div className={cx('wrapper')}>
                        <div className={cx('controller-wraper')}>
                            <Button
                                to="/"
                                font="thick"
                                classNameOther={cx('controller-item', {
                                    active: isHomePage,
                                })}
                                IconSvg={
                                    <HomeIcon
                                        className={cx('controller-icon')}
                                    />
                                }
                            >
                                Dành cho bạn
                            </Button>
                            <Button
                                to="/following"
                                font="thick"
                                classNameOther={cx('controller-item', {
                                    active: isFollowPage,
                                })}
                                IconSvg={
                                    <GroudIcon
                                        className={cx('controller-icon')}
                                    />
                                }
                            >
                                Đang Follow
                            </Button>
                            <Button
                                to="/"
                                font="thick"
                                classNameOther={cx('controller-item')}
                                IconSvg={
                                    <LiveIcon
                                        className={cx('controller-icon')}
                                    />
                                }
                            >
                                LIVE
                            </Button>
                        </div>
                    </div>
                    {!isAuthenticated && (
                        <div className={cx('wrapper')}>
                            <div className={cx('login')}>
                                <span className={cx('title')}>
                                    Đăng nhập để follow các tác giả, thích video
                                    và xem bình luận.
                                </span>
                                <Button
                                    outline
                                    fullwidth
                                    size="large"
                                    onClick={toggle}
                                >
                                    Đăng nhập
                                </Button>
                                <ModalAuth
                                    isShowing={isShowing}
                                    toggle={toggle}
                                />
                            </div>
                        </div>
                    )}
                    <div className={cx('wrapper')}>
                        <div className={cx('accounts-suggest')}>
                            <h4 className={cx('title')}>
                                Tài khoản được đề suất
                            </h4>
                            {isLoadingSg ? (
                                <Skeleton type={'user'} />
                            ) : (
                                <>
                                    {suggesters
                                        .slice(0, limit.suggest)
                                        .map((data) => (
                                            <SearchAccountItem
                                                size={'small'}
                                                className={cx(
                                                    'account-suggest-item',
                                                )}
                                                key={data._id}
                                                data={data}
                                            />
                                        ))}
                                </>
                            )}
                            <Button
                                classNameOther={cx('account-suggest-more')}
                                onClick={() => {
                                    limit.suggest === limitMore
                                        ? handleReduce('suggest')
                                        : handleMore('suggest');
                                }}
                            >
                                {limit.suggest === limitMore
                                    ? 'Ẩn bớt'
                                    : 'Xem tất cả'}
                            </Button>
                        </div>
                    </div>
                    {isAuthenticated && (
                        <div className={cx('wrapper')}>
                            <div className={cx('accounts-following')}>
                                <h4 className={cx('title')}>
                                    Các tài khoản đang follow
                                </h4>
                                {isLoadingSg ? (
                                    <Skeleton type={'user'} />
                                ) : (
                                    <>
                                        {followings.length > 0 ? (
                                            //Danh sách những người đang follow
                                            <>
                                                {followings
                                                    .slice(0, limit.following)
                                                    .map((data) => (
                                                        <SearchAccountItem
                                                            size={'small'}
                                                            className={cx(
                                                                'account-suggest-item',
                                                            )}
                                                            key={data._id}
                                                            data={data}
                                                        />
                                                    ))}
                                                <Button
                                                    classNameOther={cx(
                                                        'account-following-more',
                                                    )}
                                                    onClick={() => {
                                                        limit.following ===
                                                        limitMore
                                                            ? handleReduce(
                                                                  'following',
                                                              )
                                                            : handleMore(
                                                                  'following',
                                                              );
                                                    }}
                                                >
                                                    {limit.following ===
                                                    limitMore
                                                        ? 'Ẩn bớt'
                                                        : 'Xem thêm'}
                                                </Button>
                                            </>
                                        ) : (
                                            <span
                                                className={cx(
                                                    'nofollowing-title',
                                                )}
                                            >
                                                Những tài khoản bạn follow sẽ
                                                xuất hiện tại đây
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={cx('wrapper')}>
                        <div className={cx('explore')}>
                            <h4 className={cx('title')}>Khám phá</h4>
                            <div className={cx('explore-body')}>
                                <a className={cx('hashtag')} href={'/'}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    <span className={cx('hashtag-name')}>
                                        sansangthaydoi
                                    </span>
                                </a>
                                <a className={cx('hashtag')} href={'/'}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    <span className={cx('hashtag-name')}>
                                        sansang
                                    </span>
                                </a>
                                <a className={cx('hashtag')} href={'/'}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    <span className={cx('hashtag-name')}>
                                        sansangthaydoibane hfdshgfjifshfo
                                    </span>
                                </a>
                                <a className={cx('hashtag')} href={'/'}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    <span className={cx('hashtag-name')}>
                                        sansangthaydoi
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={cx('footer')}>
                        <div className={cx('container-links')}>
                            <a className={cx('footer-link')} href="/">
                                Giới thiệu
                            </a>
                            <a className={cx('footer-link')} href="/">
                                TikTok Browse
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Bảng tin
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Liên hệ
                            </a>
                            <a className={cx('footer-link')} href="/">
                                ByteDance
                            </a>
                        </div>
                        <div className={cx('container-links')}>
                            <a className={cx('footer-link')} href="/">
                                TikTok for Good
                            </a>

                            <a className={cx('footer-link')} href="/">
                                Quảng cáo
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Developers
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Transparency
                            </a>
                            <a className={cx('footer-link')} href="/">
                                TikTok Rewards
                            </a>
                        </div>
                        <div className={cx('container-links')}>
                            <a className={cx('footer-link')} href="/">
                                Trợ giúp
                            </a>
                            <a className={cx('footer-link')} href="/">
                                An toàn
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Điều khoản
                            </a>
                            <a className={cx('footer-link')} href="/">
                                Quyền riêng tư
                            </a>
                        </div>
                        <span className={cx('footer-title')}>
                            © 2022 TikTok
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('scrollbar')}>
                <div ref={scrollTrackRef} className={cx('track')}></div>
            </div>
            <div className={cx('body-tablet')}>
                <div className={cx('top-container')}>
                    <Tippy content="Home" placement="right">
                        <Link
                            to={'/'}
                            className={cx('top-item', {
                                active: isHomePage,
                            })}
                        >
                            <HomeIcon />
                        </Link>
                    </Tippy>
                    <Tippy content="Following" placement="right">
                        <Link
                            to={'/following'}
                            className={cx('top-item', {
                                active: isFollowPage,
                            })}
                        >
                            <GroudIcon />
                        </Link>
                    </Tippy>
                    <Tippy content="Live" placement="right">
                        <div className={cx('top-item')}>
                            <LiveIcon />
                        </div>
                    </Tippy>
                </div>

                <div className={cx('user-container')}>
                    {isLoadingSg ? (
                        <>
                            <Skeleton type="user" isOnlyAvatar={true} />
                            <Skeleton type="user" isOnlyAvatar={true} />
                            <Skeleton type="user" isOnlyAvatar={true} />
                            <Skeleton type="user" isOnlyAvatar={true} />
                            <Skeleton type="user" isOnlyAvatar={true} />
                        </>
                    ) : (
                        <>
                            {suggesters.slice(0, limitMore).map((item) => (
                                <SearchAccountItem
                                    key={item._id}
                                    data={item}
                                    size="small"
                                    isOnlyAvatar={true}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBar;
