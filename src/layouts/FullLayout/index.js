import classNames from 'classnames/bind';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import styles from './FullLayout.module.scss';

const cx = classNames.bind(styles);
function FullLayout({ children }) {
    return (
        <div className={cx('app')}>
            <Header fullWidth />
            <div className={cx('container')}>
                <div className={cx('navbar')}>
                    <SideBar small />
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default FullLayout;
