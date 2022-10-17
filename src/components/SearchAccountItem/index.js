import styles from './SearchAccountItem.module.scss';
import classnames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classnames.bind(styles);

function SearchAccountItem({
    data,
    className,
    size = 'medium',
    isOnlyAvatar = false,
}) {
    return (
        <Link
            to={`/@${data.nickname}`}
            className={cx('item', isOnlyAvatar ? 'only-avatar' : '', {
                [className]: className,
                [size]: size,
            })}
        >
            <img src={data.avatar} alt={'avata'} className={cx('image')}></img>
            <div className={cx('info')}>
                <div className={cx('username')}>
                    <span>{data.nickname}</span>
                    {data.tick && (
                        <FontAwesomeIcon
                            className={cx('icon')}
                            icon={faCheckCircle}
                        />
                    )}
                </div>
                <span className={cx('name')}>{data.fullname}</span>
            </div>
        </Link>
    );
}

export default SearchAccountItem;
