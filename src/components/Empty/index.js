import classNames from "classnames/bind";
import styles from './Empty.module.scss';

const cx = classNames.bind(styles);

function Empty({Icon, title, subtitle,}) {
    return ( <div className={cx('wrapper')}>
        <div className={cx('icon')}>
            {Icon}
        </div>
        <span className={cx('title')}>{title}</span>
        <span className={cx('sub_title')}>{subtitle}</span>
    </div> );
}

export default Empty;