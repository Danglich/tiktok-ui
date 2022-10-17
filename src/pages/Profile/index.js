import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
    CopyLinkIcon,
    EmbedIcon,
    FacebookIcon,
    TwitterIcon,
} from '~/components/Action/icons';
import Button from '~/components/Button';
import FollowButton from '~/components/FollowButton';
import GoToTop from '~/components/GoToTop';
import {
    BlockIcon,
    LockIconLarge,
    LockIconSmall,
    MoreIcon,
    NoUserIcon,
    ReportIcon,
    ShareIcon,
    UploadIcon,
} from '~/components/Icons';
import Menu from '~/components/Popper/Menu';
import { AuthContext } from '~/contexts/AuthContext';
import { apiUrl } from '~/contexts/constants';
import VideoItem from './components/VideoItem';
import styles from './Profile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import useModal from '~/hooks/useModal';
import ModalAuth from '~/components/ModalAuth';
import Empty from '~/components/Empty';
import ModalEditProfile from '~/components/ModalEditProfile';
import { MessageContext } from '~/contexts/MessageContext';
import { addDocument } from '~/firebase/services';
import firebase from '~/firebase/config';
import Skeleton from '~/components/Skeleton';

const cx = classNames.bind(styles);
function Profile() {
    const videoUploadedRef = useRef(null);
    const videoLikedRef = useRef();
    const outLineRef = useRef();
    const [videos, setVideos] = useState([]);
    const [isFollowed, setIsFollowed] = useState(null);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [haveUser, setHaveUser] = useState(true);
    const { isShowing, toggle } = useModal();
    const [videoTag, setVideoTag] = useState(true);
    const [videosLiked, setVideosLiked] = useState([]);
    const [isLoadingVideoLiked, setIsLoadingVideoLiked] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();

    const { roomsInfo, setSelectedRoomId } = useContext(MessageContext);

    const location = useLocation();

    const [user, setUser] = useState({
        followings: [],
        followers: [],
        videosLiked: [],
    });

    const { authState } = useContext(AuthContext);
    const me = authState.user;

    const params = useParams();
    const nickname = params.nickname;

    useEffect(() => {
        window.document.title = nickname;
    }, [nickname]);

    useEffect(() => {
        if (me && user.nickname) {
            setIsMyProfile(me.nickname === nickname);
            setIsFollowed(me.followings.includes(user._id));
        }
    }, [me, user, nickname]);

    useEffect(() => {
        let isSubscribed = true;
        const fetchData = async () => {
            setIsLoadingUser(true);
            try {
                const result = await axios.get(
                    `${apiUrl}/videos/uploaded/${nickname}`,
                );
                if (isSubscribed && result) {
                    setVideos(result.data.videos);
                    setUser(result.data.user);
                    setHaveUser(true);
                    setIsLoadingUser(false);
                }
            } catch (error) {
                if (error.response.data) {
                    setHaveUser(false);
                }
            }
        };

        fetchData();
        return () => (isSubscribed = false);
    }, [nickname]);

    const fetchVideosLiked = useMemo(
        () => async () => {
            setIsLoadingVideoLiked(true);
            try {
                const result = await axios.get(`${apiUrl}/videos/liked`);
                if (result) {
                    setVideosLiked(result.data);
                }
                setIsLoadingVideoLiked(false);
            } catch (error) {}
        },
        [],
    );

    useEffect(() => {
        const videoUploadMs = () => {
            outLineRef.current.style.transform = `translateX(0px)`;
        };
        const videoUploadMl = () => {
            outLineRef.current.style.transform = `translateX(${
                videoTag ? '0px' : '230px'
            })`;
        };

        const videoLikedMs = () => {
            outLineRef.current.style.transform = `translateX(230px)`;
        };
        const videoLikedMl = () => {
            outLineRef.current.style.transform = `translateX(${
                videoTag ? '0px' : '230px'
            })`;
        };

        if (videoUploadedRef.current) {
            videoUploadedRef.current.addEventListener(
                'mouseenter',
                videoUploadMs,
            );
            videoUploadedRef.current.addEventListener(
                'mouseleave',
                videoUploadMl,
            );
        }

        if (videoLikedRef.current) {
            videoLikedRef.current.addEventListener('mouseenter', videoLikedMs);
            videoLikedRef.current.addEventListener('mouseleave', videoLikedMl);
        }
    }, [videoTag, videoUploadedRef, haveUser]);

    useEffect(() => {
        if (isMyProfile && !videoTag && videosLiked.length === 0) {
            fetchVideosLiked();
        }
    }, [videoTag, isMyProfile, videosLiked.length, fetchVideosLiked]);

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

    const LIST_MORE = [
        {
            title: 'Gửi tin nhắn',
            iconSvg: <UploadIcon width={'1.6rem'} height={'1.6rem'} />,
        },
        {
            title: 'Báo cáo',
            iconSvg: <ReportIcon />,
        },
        {
            title: 'Chặn',
            iconSvg: <BlockIcon />,
        },
    ];

    const handleFollow = () => {
        setIsFollowed(true);
    };

    const handleUnFollow = () => {
        setIsFollowed(false);
    };

    const handleSendMessage = () => {
        let sended = false;
        let roomId = '';
        roomsInfo.forEach((room) => {
            if (room.members.includes(user?._id)) {
                roomId = room.id;
                sended = true;
            }
        });

        if (sended && roomId) {
            setSelectedRoomId(roomId);
            navigate('/messages');
        } else {
            addDocument('rooms', {
                members: [me?._id, user?._id],
                updateAt: firebase.firestore.FieldValue.serverTimestamp(),
                newMessage: '',
            });
            setSelectedRoomId('');
            navigate('/messages');
        }
    };

    //State sang trang detail video
    const videosId = useMemo(() => {
        return videos.map((video) => ({
            _id: video._id,
            nickname: video.user.nickname,
        }));
    }, [videos]);

    const videosLikedId = useMemo(() => {
        return videosLiked.map((video) => ({
            _id: video._id,
            nickname: video.user.nickname,
        }));
    }, [videosLiked]);

    if (haveUser === true)
        return (
            <div className={cx('container')}>
                {isLoadingUser ? (
                    <Skeleton type="userProfile" />
                ) : (
                    <div className={cx('user')}>
                        <div className={cx('info')}>
                            <div
                                className={cx('avatar')}
                                style={{
                                    backgroundImage: `url(${user.avatar})`,
                                }}
                            ></div>
                            <div className={cx('sub-info')}>
                                <span className={cx('nickname')}>
                                    {user.nickname}
                                </span>
                                <span className={cx('fullname')}>
                                    {user.fullname}
                                </span>

                                {!isMyProfile && isFollowed === false && me && (
                                    <FollowButton
                                        //key={isFollowed}
                                        userid={user?._id}
                                        classNameOther={cx('follow-btn')}
                                        primary
                                        onClick={handleFollow}
                                        nickname={user?.nickname}
                                    />
                                )}

                                {!me && (
                                    <>
                                        <Button
                                            classNameOther={cx('follow-btn')}
                                            primary
                                            onClick={toggle}
                                        >
                                            Follow
                                        </Button>

                                        <ModalAuth
                                            isShowing={isShowing}
                                            toggle={toggle}
                                        />
                                    </>
                                )}

                                {!isMyProfile && isFollowed === true && me && (
                                    <div className={cx('followed')}>
                                        <Button
                                            //key={isFollowed}
                                            classNameOther={cx('message_btn')}
                                            outline
                                            size="medium"
                                            onClick={handleSendMessage}
                                        >
                                            Tin nhắn
                                        </Button>
                                        <FollowButton
                                            //key={isFollowed}
                                            nickname={nickname}
                                            classNameOther={cx('follow-btn')}
                                            primary
                                            followed={isFollowed}
                                            onClick={handleUnFollow}
                                        >
                                            <Tippy
                                                content="Bỏ follow"
                                                placement="bottom"
                                            >
                                                <div
                                                    className={cx(
                                                        'unfollow_icon--wrapper',
                                                    )}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faUserCheck}
                                                    />
                                                </div>
                                            </Tippy>
                                        </FollowButton>
                                    </div>
                                )}

                                {isMyProfile && me && (
                                    <>
                                        <Button
                                            onClick={toggle}
                                            classNameOther={cx('follow-btn')}
                                            primary
                                        >
                                            Sửa hồ sơ
                                        </Button>
                                        <ModalEditProfile
                                            isShowing={isShowing}
                                            toggle={toggle}
                                            data={me}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={cx('quantity')}>
                            <div className={cx('followings')}>
                                <strong>{user.followings.length}</strong>
                                <span className={cx('title')}>Đang follow</span>
                            </div>
                            <div className={cx('follower')}>
                                <strong>{user.followers.length}</strong>
                                <span className={cx('title')}>Follower</span>
                            </div>
                            <div className={cx('likes')}>
                                <strong>{user.likes}</strong>
                                <span className={cx('title')}>Thích</span>
                            </div>
                        </div>
                        <div className={cx('bio')}>
                            <p>{user.bio}</p>
                        </div>
                        <div className={cx('action')}>
                            <Menu items={LIST_SHARES} offset={[160, 10]}>
                                <div className={cx('share')}>
                                    <ShareIcon />
                                </div>
                            </Menu>

                            {!isMyProfile && (
                                <Menu items={LIST_MORE} offset={[160, 10]}>
                                    <div className={cx('more')}>
                                        <MoreIcon />
                                    </div>
                                </Menu>
                            )}
                        </div>
                    </div>
                )}
                <div className={cx('body')}>
                    <div className={cx('control')}>
                        <div
                            ref={videoUploadedRef}
                            className={cx('wrap-block', {
                                active: videoTag,
                            })}
                            onClick={() => {
                                setVideoTag(true);
                            }}
                        >
                            <p className={cx('videos-uploaded')}>Video</p>
                        </div>
                        <div
                            ref={(e) => {
                                videoLikedRef.current = e;
                            }}
                            className={cx('wrap-block', {
                                active: !videoTag,
                            })}
                            onClick={() => {
                                setVideoTag(false);
                            }}
                        >
                            <LockIconSmall />
                            <p className={cx('videos-liked')}>Đã thích</p>
                        </div>
                        <div
                            ref={outLineRef}
                            className={cx('outline-btn')}
                        ></div>
                    </div>
                    {videoTag ? (
                        <div className={cx('videos')}>
                            {isLoadingUser && (
                                <Skeleton
                                    type="box"
                                    size={'medium'}
                                    count={5}
                                />
                            )}
                            {videos.length > 0 ? (
                                <>
                                    {videos.map((video, index) => (
                                        <VideoItem
                                            key={video.url}
                                            video={video}
                                            location={location}
                                            user={user}
                                            videosId={videosId}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {isMyProfile ? (
                                        <Empty
                                            Icon={<NoUserIcon />}
                                            title={
                                                'Tải video đầu tiên của bạn lên'
                                            }
                                            subtitle={
                                                'Video của bạn sẽ suất hiện ở đây.'
                                            }
                                        ></Empty>
                                    ) : (
                                        <Empty
                                            Icon={<NoUserIcon />}
                                            title={'Không có nội dung'}
                                            subtitle={
                                                'Người này chưa chia sẻ bất kì nội dung nào.'
                                            }
                                        ></Empty>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={cx('videos_liked')}>
                            {isMyProfile ? (
                                <>
                                    {isLoadingVideoLiked ? (
                                        <Skeleton
                                            type="box"
                                            count={6}
                                            size={'small'}
                                        />
                                    ) : (
                                        <>
                                            {videosLiked.length > 0 ? (
                                                <>
                                                    {videosLiked.map(
                                                        (video, index) => (
                                                            <VideoItem
                                                                key={video.url}
                                                                video={video}
                                                                location={
                                                                    location
                                                                }
                                                                videosId={
                                                                    videosLikedId
                                                                }
                                                                user={
                                                                    video.user
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </>
                                            ) : (
                                                <Empty
                                                    Icon={<NoUserIcon />}
                                                    title={
                                                        'Chưa thích video nào'
                                                    }
                                                    subtitle={
                                                        'Những video bạn thích sẽ suất hiện ở đây.'
                                                    }
                                                ></Empty>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <Empty
                                    Icon={<LockIconLarge />}
                                    title={
                                        'Video đã thích của người dùng này ở trạng thái riêng tư'
                                    }
                                    subtitle={`Các video được thích bởi ${user.nickname} hiện đang ẩn.`}
                                ></Empty>
                            )}
                        </div>
                    )}
                </div>
                <GoToTop />
            </div>
        );

    if (haveUser === false) {
        return (
            <div className={cx('container')}>
                <div className={cx('no_user')}>
                    <div className={cx('no_user--icon')}>
                        <NoUserIcon />
                    </div>
                    <span className={cx('no_user--title')}>
                        Không thể tìm thấy tài khoản này
                    </span>
                    <span className={cx('no_user--subtitle')}>
                        Bạn đang tìm kiếm video? Hãy thử duyệt tìm các tác giả,
                        hashtag và âm thanh thịnh hành của chúng tôi.
                    </span>
                </div>
            </div>
        );
    }
}

export default Profile;
