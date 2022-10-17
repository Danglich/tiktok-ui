import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import Button from '~/components/Button';
import UploadVideo from '~/components/UploadVideo';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';

import Modal from '~/components/Modal';
import useModal from '~/hooks/useModal';
import { useRef } from 'react';
import { apiUrl } from '~/contexts/constants';
import { notify } from '~/utils/toast';
import { awaitTimeout } from '~/utils/wait';
import ModalLoading from '~/components/ModalLoading';
import { Link } from 'react-router-dom';
import { AuthContext } from '~/contexts/AuthContext';
import Emoji from '~/components/Emoji';
import { useCallback } from 'react';

const cx = classNames.bind(styles);

function Upload() {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const [url, setUrl] = useState();
    const [formData, setFormData] = useState({
        desc: '',
        regime: 1,
        comment: true,
    });

    const [isUnDisabled, setIsUnDisabled] = useState(false);

    const uploadBlockRef = useRef();
    const containerRef = useRef();

    const { isShowing, toggle } = useModal();
    const [isUploading, setIsUploading] = useState(false);
    const [upLoaded, setUpLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Tải lên | Tiktok';
    }, []);

    useEffect(() => {
        $('html, body').animate({ scrollTop: 0 }, 0);
    }, []);

    const handleChangeInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //Get url from UploadVideo component
    const handleGetUrl = (url) => {
        setUrl(url);
    };

    const handeCancel = () => {
        toggle();
        uploadBlockRef.current.handeCancel();
        setUrl();
        setFormData({
            desc: '',
            regime: 1,
            comment: true,
        });
        setIsUnDisabled(false);
    };
    const handleCancelUploaded = () => {
        uploadBlockRef.current.handeCancelUploaded();
        setUrl();
        setFormData({
            desc: '',
            regime: 1,
            comment: true,
        });
        setIsUnDisabled(false);
    };

    const handleUnDisabled = () => {
        setIsUnDisabled(true);
    };

    const handleDisabled = () => {
        setIsUnDisabled(false);
    };

    //Tới trang cá nhân
    const handleUpMoreVideo = () => {
        setUpLoaded(false);
        toggle();
    };

    const handleSubmit = async () => {
        setIsUploading(true);
        try {
            await axios
                .post(`${apiUrl}/videos`, {
                    ...formData,
                    url: url,
                })
                .then((response) => {});

            setIsUploading(false);
            setUpLoaded(true);
            toggle();
            notify('Upload successfully', 'success');
            await awaitTimeout(800);

            handleCancelUploaded();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectEmoji = useCallback(
        (emoji) => {
            setFormData({ ...formData, desc: formData.desc + emoji });
        },
        [formData],
    );

    if (isUploading) {
        return <ModalLoading />;
    }

    return (
        <div ref={containerRef} className={cx('container')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <h3 className={cx('header-title')}>Tải video lên</h3>
                    <span className={cx('header-sub-title')}>
                        Đăng video lên tài khoản của bạn
                    </span>
                </div>
                <div className={cx('body')}>
                    <UploadVideo
                        handleUnDisabled={handleUnDisabled}
                        handleDisabled={handleDisabled}
                        ref={uploadBlockRef}
                        handleGetUrl={handleGetUrl}
                    />
                    <div className={cx('options')}>
                        <form>
                            <div className={cx('description')}>
                                <label>Chú thích</label>
                                <textarea
                                    name="desc"
                                    className={cx('description-input')}
                                    value={formData.desc || ''}
                                    onChange={handleChangeInput}
                                />
                                <div className={cx('emoji-container')}>
                                    <Emoji
                                        handleSelectEmoji={handleSelectEmoji}
                                    />
                                </div>
                            </div>

                            <div className={cx('regime')}>
                                <label>Ai có thể xem video này</label>
                                <select
                                    className={cx('regime-select')}
                                    onChange={handleChangeInput}
                                    name="regime"
                                    value={formData.regime}
                                >
                                    <option value={1}>Công khai</option>
                                    <option value={2}>Bạn bè</option>
                                    <option value={3}>Riêng tư</option>
                                </select>
                            </div>
                            <div className={cx('allow-comment')}>
                                <label>Cho phép người dùng</label>
                                <input
                                    name="comment"
                                    className={cx('allow-comment-btn')}
                                    type="checkbox"
                                    checked={formData.comment}
                                    value={formData.comment || true}
                                    onChange={handleChangeInput}
                                />
                                <label className={cx('allow-comment-title')}>
                                    Bình luận
                                </label>
                            </div>
                        </form>
                        <div className={cx('btn')}>
                            <Button
                                onClick={() => {
                                    if (!upLoaded) {
                                        toggle();
                                    }
                                }}
                                size={'large'}
                                borderDefault
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                disabled={isUnDisabled ? false : true}
                                onClick={handleSubmit}
                                primary
                                size={'large'}
                            >
                                Đăng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {upLoaded ? (
                <Modal
                    handeCancel={handleUpMoreVideo}
                    isShowing={isShowing}
                    toggle={toggle}
                    title="Video của bạn đã được tải lên TikTok !"
                    subTitle=""
                    cancel={'Tải video khác lên'}
                    continues={
                        <Link
                            to={`/@${user?.nickname}`}
                            className={cx('link-profile')}
                        >
                            Xem hồ sơ
                        </Link>
                    }
                />
            ) : (
                <Modal
                    handeCancel={handeCancel}
                    isShowing={isShowing}
                    toggle={toggle}
                    title="Hủy bỏ bài đăng này?"
                    subTitle="Video và tất cả các chỉnh sửa sẽ bị hủy bỏ"
                    cancel="Hủy bỏ"
                    continues="Tiếp tục chỉnh sửa"
                />
            )}
        </div>
    );
}

export default Upload;
