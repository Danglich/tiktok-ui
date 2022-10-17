import classNames from 'classnames/bind';
import styles from './UploadVideo.module.scss';
import { useState, forwardRef } from 'react';
import axios from 'axios';

import Button from '../Button';
import cloudinary from '~/utils/cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

import Modal from '~/components/Modal';
import useModal from '~/hooks/useModal';
import { useImperativeHandle } from 'react';
import setAuthToken from '~/utils/setAuthToken';
import { LOCAL_STORAGE_TOKEN_NAME } from '~/contexts/constants';
import ModalLoading from '../ModalLoading';

const cx = classNames.bind(styles);
function UpLoadVideo({ handleGetUrl, handleUnDisabled, handleDisabled }, ref) {
    const { isShowing, toggle } = useModal();

    const [file, setFile] = useState();
    const [currentId, setCurrentId] = useState();
    const [url, setUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = async (e) => {
        setFile(e.target.files[0]);

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('file', e.target.files[0]);
        }
        formData.append('upload_preset', 'tiktok');
        try {
            delete axios.defaults.headers.common['Authorization'];
            setIsLoading(true);
            await axios
                .post(
                    `https://api.cloudinary.com/v1_1/ddfmsvgeb/auto/upload`,
                    formData,
                )
                .then((response) => {
                    const data = response.data;
                    setCurrentId(data.public_id);
                    setUrl(data.url);
                    handleGetUrl(data.url);
                    handleUnDisabled();
                });

            setIsLoading(false);

            //Thêm lại header cho axios
            const token = JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME),
            );

            if (token) {
                setAuthToken(token);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handeCancel = () => {
        toggle();
        if (currentId) {
            deleteVideo(currentId);
        }

        setUrl();
        setCurrentId();
        setFile();
        handleDisabled();
    };

    useImperativeHandle(ref, () => ({
        handeCancel() {
            if (currentId) {
                deleteVideo(currentId);
            }

            setUrl();
            setCurrentId();
            setFile();
        },

        isHasVideo() {
            return !!file;
        },

        //Xóa video trên màn hình sau khi tạo video thành công
        handeCancelUploaded() {
            setUrl();
        },
    }));

    const deleteVideo = async (currentId) => {
        try {
            const result = await cloudinary.uploader.destroy(
                currentId,
                function (result) {},
                {
                    resource_type: 'video',
                },
            );

            console.log(result);
            console.log(currentId);
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div
                htmlFor="file-upload"
                className={cx('block-upload', 'loading')}
            >
                <div className={cx('spinner')}></div>
                <span className={cx('title')}>Vui lòng chờ...</span>
                <ModalLoading />
            </div>
        );
    }

    return (
        //

        <>
            {!url ? (
                <>
                    <label htmlFor="file-upload" className={cx('block-upload')}>
                        <div>
                            <div>
                                <img
                                    className={cx('img')}
                                    src={
                                        'https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg'
                                    }
                                    alt={'upload'}
                                />
                            </div>
                            <span className={cx('title')}>
                                Chọn video để tải lên
                            </span>
                            <span className={cx('description')}>
                                MP4 hoặc WebM
                            </span>
                            <span className={cx('description')}>
                                Ít hơn 1GB
                            </span>
                        </div>
                        <Button classNameOther={cx('btn')} primary>
                            <label htmlFor="file-upload">Chọn tập tin</label>
                        </Button>
                    </label>
                    <input
                        onChange={handleChange}
                        type="file"
                        id="file-upload"
                        accept="video/mp4"
                        className={cx('input-file')}
                    />
                </>
            ) : (
                <div className={cx('review')}>
                    <div className={cx('video-wrapper')}>
                        <video
                            className={cx('video-block')}
                            src={url}
                            controls
                        ></video>
                    </div>
                    <div className={cx('change-video')}>
                        <div className={cx('current-name')}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <span className={cx('name')}>{file.name}</span>
                        </div>
                        <button onClick={toggle} className={cx('change-btn')}>
                            Thay đổi video
                        </button>
                    </div>
                    <Modal
                        handeCancel={handeCancel}
                        isShowing={isShowing}
                        toggle={toggle}
                        title="Thay thế video này?"
                        subTitle="Chú thích và cài đặt video vẫn được lưu"
                        cancel="Thay thế"
                        continues="Tiếp tục chỉnh sửa video"
                    />
                </div>
            )}
        </>
    );
}

export default forwardRef(UpLoadVideo);
