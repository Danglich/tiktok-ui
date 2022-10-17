import classNames from 'classnames/bind';
import { Loading } from '../Icons';
import styles from './ModalLoading.module.scss';

const cx = classNames.bind(styles);

function ModalLoading() {
    return (
        <div className={cx('container')}>
            {/* <div className={cx('spinner')}></div>
            <span className={cx('title')}>Loading....</span> */}
            <Loading />
        </div>
    );
}

export default ModalLoading;
