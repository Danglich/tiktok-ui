import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Popper from '~/components/Popper';
import MenuItem from './MenuItem';
import Arrow from '~/components/Arrow';

const cx = classNames.bind(styles);

function Menu({ items, offset, children }) {
    const [history, setHistory] = useState([{ data: items }]);

    const current = history[history.length - 1];
    const renderItem = () => {
        return current.data.map((dataItem, index) => {
            const isParent = !!dataItem.children;
            const handleOnClick = dataItem.onClick;
            return (
                <MenuItem
                    onClick={() => {
                        if (handleOnClick) {
                            handleOnClick();
                        }
                        if (isParent) {
                            setHistory((prev) => [...prev, dataItem.children]);
                        }
                    }}
                    key={index}
                    item={dataItem}
                ></MenuItem>
            );
        });
    };
    return (
        <Tippy
            hideOnClick={false}
            offset={offset || [10, 10]}
            onHide={() => {
                setHistory([{ data: items }]);
            }}
            delay={[0, 750]}
            interactive
            placement="bottom-start"
            render={({ attrs }) => (
                <div className="box" tabIndex="-1" {...attrs}>
                    <Popper>
                        <div className={cx('menu-list-wrap')}>
                            {history.length > 1 && (
                                <div className={cx('header')}>
                                    <button
                                        onClick={() => {
                                            setHistory(history.slice(0, -1));
                                        }}
                                        className={cx('back-btn')}
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <span className={cx('header-title')}>
                                        {current.title}
                                    </span>
                                </div>
                            )}
                            <div className={cx('menu-body')}>
                                {renderItem()}
                            </div>
                        </div>
                    </Popper>
                    <Arrow data-popper-arrow></Arrow>
                </div>
            )}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
