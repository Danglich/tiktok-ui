import classNames from 'classnames/bind';
import styles from './Skeleton.module.scss';

const cx = classNames.bind(styles);

function Skeleton({ type, isOnlyAvatar, size, count }) {
    const SkeletonUser = () => (
        <div
            className={cx(
                'user-container',
                isOnlyAvatar ? 'only-avatar' : '',
                size ? size : '',
            )}
        >
            <div className={cx('user-img')}></div>
            <div className={cx('user-info')}>
                <div className={cx('user-text', 'first')}></div>
                <div className={cx('user-text', 'last')}></div>
            </div>
        </div>
    );

    const SkeletonComment = () => (
        <div className={cx('comment-container')}>
            <div className={cx('img')}></div>
            <div className={cx('info')}>
                <div className={cx('nickname')}></div>
                <div className={cx('text')}></div>
                <div className={cx('time')}></div>
            </div>
        </div>
    );

    const SkeletonBox = () => (
        <div className={cx('box', size ? size : '')}>
            <div className={cx('load')}></div>
        </div>
    );

    const SkeletonUserProfile = () => (
        <div className={cx('user-profile-container')}>
            <div className={cx('img')}></div>
            <div className={cx('info')}>
                <div className={cx('nickname')}></div>
                <div className={cx('fullname')}></div>
            </div>
        </div>
    );

    const SkeletonItemVideoLarge = () => (
        <div className={cx('item-video-large-container')}>
            <div className={cx('img')}></div>
            <div className={cx('right')}>
                <div className={cx('text', 'text1')}></div>
                <div className={cx('text', 'text2')}></div>
                <div className={cx('text', 'text3')}></div>
                <div className={cx('text', 'text4')}></div>
            </div>
        </div>
    );

    if (type === 'user') return <SkeletonUser />;
    if (type === 'comment') return <SkeletonComment />;
    if (type === 'box')
        return Array(count)
            .fill(1)
            .map((item, index) => {
                return <SkeletonBox key={index} />;
            });
    if (type === 'userProfile') return <SkeletonUserProfile />;
    if (type === 'itemVideoLarge') return <SkeletonItemVideoLarge />;
}

export default Skeleton;
