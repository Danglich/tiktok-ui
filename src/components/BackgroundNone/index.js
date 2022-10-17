import classNames from 'classnames/bind';
import styles from './BackgroundNone.module.scss';

const cx = classNames.bind(styles);

function BackgroundNone() {
    console.log('background-none');
    return <div className={cx('wrapper')}>xin chào</div>;
}

export default BackgroundNone;
