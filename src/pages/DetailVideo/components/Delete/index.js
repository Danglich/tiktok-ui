import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '~/components/Modal';
import { apiUrl } from '~/contexts/constants';
import useModal from '~/hooks/useModal';
import { notify } from '~/utils/toast';
import { awaitTimeout } from '~/utils/wait';
import styles from './Delete.module.scss';

const cx = classNames.bind(styles);
function Delete({ videoId }) {
    const { isShowing, toggle } = useModal();
    const navigate = useNavigate();

    const handleDelete = useCallback(async () => {
        try {
            const result = await axios.post(
                `${apiUrl}/videos/delete/${videoId}`,
            );
            if (result.data.success) {
                notify('Đã xóa video!', 'success');
                await awaitTimeout(700);
                navigate(-1);
            }
        } catch (error) {}

        toggle();
    }, [videoId]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('icon')}>
                <FontAwesomeIcon icon={faEllipsis} />
            </div>
            <ul className={cx('options_wrapper')}>
                <li onClick={toggle} className={cx('delete')}>
                    Xóa
                </li>
            </ul>
            <Modal
                isShowing={isShowing}
                toggle={toggle}
                title="Bạn có chắc chắn muốn xóa video này ?"
                continues="Hủy bỏ"
                cancel="Xóa"
                handeCancel={handleDelete}
            />
        </div>
    );
}

export default Delete;
