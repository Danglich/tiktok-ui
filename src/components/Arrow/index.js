import classNames from 'classnames/bind';
import styles from './Arrow.module.scss';

const cx = classNames.bind(styles);

function Arrow() {
    return <div className={cx('wrapper')}></div>;
}

export default Arrow;
