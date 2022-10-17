import classNames from 'classnames/bind';
import styles from './GoToTop.module.scss';
import { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

import Button from '~/components/Button';
import { TopIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function GoToTop() {
    const [hasTop, setHasTop] = useState(false);
    const btnUpRef = useRef();
    const handleHasTopBtn = () => {
        if (document.documentElement.scrollTop > 0 && !hasTop) {
            setHasTop(true);
        }
        if (document.documentElement.scrollTop === 0) {
            setHasTop(false);
        }
    };

    const handleScrollTop = () => {
        //Sử dụng Jquery Animate
        $('html, body').animate({ scrollTop: 0 }, 700);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleHasTopBtn);

        return () => {
            window.removeEventListener('scroll', handleHasTopBtn);
        };
    }, []);

    useEffect(() => {
        if (btnUpRef.current) {
            btnUpRef.current.addEventListener('click', handleScrollTop);

            return () => {
                btnUpRef.current.removeEventListener('click', handleScrollTop);
            };
        }
    }, []);
    return (
        <div className={cx('action')}>
            <div className={cx('download-app')}>
                <Button round borderDefault>
                    Tải ứng dụng
                </Button>
            </div>
            {hasTop && (
                <button
                    ref={btnUpRef}
                    onClick={handleScrollTop}
                    className={cx('top-btn')}
                >
                    <TopIcon />
                </button>
            )}
        </div>
    );
}

export default GoToTop;
