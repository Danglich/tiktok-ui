import classNames from 'classnames/bind';
import styles from './Volume.module.scss';
import { useSelector, useDispatch } from 'react-redux';

import { SoundIcon } from '~/components/Icons';
import { setVolume, setMute, saveVolume } from '~/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';
import { memo } from 'react';

const cx = classNames.bind(styles);

function Volume({ size }) {
    const volume = useSelector((state) => state.volume);
    const isMute = useSelector((state) => state.mute);
    const volumePrev = useSelector((state) => state.volumePrev);
    const dispatch = useDispatch();

    const volumeMax = useRef();
    const volumeCurrentRef = useRef();
    const circleRef = useRef();

    const handleSetMute = () => {
        dispatch(setMute(!isMute));
        if (isMute) {
            dispatch(setVolume(volumePrev));
        } else {
            dispatch(saveVolume(volume));
            dispatch(setVolume(0));
        }
    };

    useEffect(() => {
        volumeCurrentRef.current.style.transform = `scaleY(${volume})`;
        circleRef.current.style.top = `${100 - volume * 100}%`;
    }, [volume]);

    const handleClickSetVolume = (e) => {
        if (volumeMax.current) {
            const clickY = e.clientY;
            const heightBar = volumeMax.current.getBoundingClientRect().height;
            const y = volumeMax.current.getBoundingClientRect().bottom;
            const height = y - clickY;
            const volume = height / heightBar;

            if (volume < 0.1) {
                dispatch(setMute(true));
                dispatch(setVolume(0));
            } else {
                dispatch(setMute(false));
                //Thay đổi thanh volume
                dispatch(setVolume(volume > 1 ? 1 : volume));
            }
        }
    };

    return (
        <div className={cx('wrapper', size ? size : '')}>
            <div className={cx('volume_control')}>
                <div
                    onClick={handleClickSetVolume}
                    className={cx('volume_max')}
                    ref={volumeMax}
                >
                    <div
                        ref={volumeCurrentRef}
                        className={cx('volume_current')}
                    ></div>
                    <div ref={circleRef} className={cx('circle')}></div>
                </div>
            </div>
            <div className={cx('volume_icon')} onClick={handleSetMute}>
                {isMute ? (
                    <FontAwesomeIcon
                        className={cx('volume-icon-mute')}
                        icon={faVolumeMute}
                    />
                ) : (
                    <SoundIcon />
                )}
            </div>
        </div>
    );
}

export default memo(Volume);
