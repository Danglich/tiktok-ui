import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { EmojiIcon } from '../Icons';
import styles from './Emoji.module.scss';
import 'tippy.js/dist/tippy.css';
import { useState } from 'react';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Emoji({ handleSelectEmoji }) {
    const [openModal, setOpenModal] = useState(false);
    const handelOpenModal = (e) => {
        e.stopPropagation();
        setOpenModal(!openModal);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        handleSelectEmoji(e.target.innerText);
    };

    useEffect(() => {
        const handleClickWindow = (e) => {
            if (openModal) {
                setOpenModal(false);
            }
        };

        window.addEventListener('click', handleClickWindow);

        return () => window.removeEventListener('click', handleClickWindow);
    }, [openModal]);

    return (
        <div className={cx('container')}>
            <Tippy content="Nhấp để thêm emoji" placement="top">
                <div className={cx('icon-wrapper')} onClick={handelOpenModal}>
                    <EmojiIcon />
                </div>
            </Tippy>
            {openModal && (
                <div className={cx('list-emoji-wrapper')}>
                    <ul className={cx('list-emoji')}>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128512;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128513;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128514;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128515;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128516;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128517;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128518;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128519;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128520;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128521;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128522;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128523;
                        </li>

                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128524;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128525;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128526;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128527;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128528;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128529;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128530;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128531;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128532;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128533;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128534;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128535;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128536;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128537;
                        </li>
                        <li className={cx('item-emoji')} onClick={handleClick}>
                            &#128538;
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Emoji;
