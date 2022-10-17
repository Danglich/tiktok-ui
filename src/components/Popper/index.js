import styles from './Popper.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

function Popper({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default Popper;
