import classNames from 'classnames/bind';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    
    return (
        <div className={cx('app')}>
            <Header />
            <div className={cx('container')}>
                <SideBar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
