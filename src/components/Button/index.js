import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);
function Button({
    classNameOther,
    to,
    href,
    fullwidth = false,
    primary = false,
    font = 'thin',
    size = 'medium',
    outline = false,
    round = false,
    borderDefault = false,
    IconLeft = null,
    IconRight = null,
    IconSvg = null,
    children,
    disabled = false,
    onClick,
    ...propsOther
}) {
    let TabName = 'button';
    let props = { onClick: onClick, ...propsOther };
    let className = cx('wrapper', {
        [classNameOther]: classNameOther,
        primary,
        outline,
        round,
        borderDefault,
        disabled,
        fullwidth,
        [size]: size,
        [font]: font,
    });
    if (to) {
        props.to = to;
        TabName = Link;
    } else if (href) {
        props.href = href;
        TabName = 'a';
    }
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }
    return (
        <TabName className={className} {...props}>
            {(IconLeft || IconRight) && (
                <div className={cx('icon')}>
                    {IconLeft && !IconSvg ? (
                        <FontAwesomeIcon icon={IconLeft} />
                    ) : (
                        IconSvg
                    )}
                </div>
            )}

            {IconSvg && <div className={cx('icon')}>{IconSvg}</div>}
            {children && <div className={cx('title')}>{children}</div>}
            {IconRight && (
                <FontAwesomeIcon className={cx('icon')} icon={IconRight} />
            )}
        </TabName>
    );
}

export default Button;
