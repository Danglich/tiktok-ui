import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ item, onClick }) {
    const seperate = item.seperate;
    const classes = cx('menu-item', {
        seperate,
    });

    return (
        <div className={cx('menu-item-wrap')}>
            <Button
                classNameOther={classes}
                IconSvg={item.iconSvg}
                IconLeft={item.icon}
                to={item.to}
                onClick={onClick}
            >
                {item.title}
            </Button>
        </div>
    );
}

export default MenuItem;
