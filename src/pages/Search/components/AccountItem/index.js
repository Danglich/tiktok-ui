import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './AccountItem.module.scss';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    return (
        <Link to={`/@${data.nickname}`}>
            <div className={cx('container')}>
                <div
                    className={cx('avatar')}
                    style={{
                        backgroundImage: `url(${data.avatar})`,
                    }}
                ></div>
                <div className={cx('info')}>
                    <span className={cx('nickname')}>{data.nickname}</span>
                    <span className={cx('name')}>{data.fullname}</span>
                    <span> . </span>
                    <div className={cx('followers')}>
                        <strong>{data.followers.length}</strong>
                        <span className={cx('followers-title')}>Followers</span>
                    </div>
                    <span className={cx('bio')}>{data.bio}</span>
                </div>
            </div>
        </Link>
    );
}

export default AccountItem;
