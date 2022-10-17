import classNames from 'classnames/bind';
import styles from './ModalSettingMessage.module.scss';
import ReactDOM from 'react-dom';
import { CloseIcon } from '../Icons';

const cx = classNames.bind(styles);

function ModalSettingMessage({ isShowing, toggle }) {
    return isShowing
        ? ReactDOM.createPortal(
              <div className={cx('modal')}>
                  <div className={cx('content')}>
                      <div className={cx('header')}>
                          <span className={cx('title')}>Cài đặt tin nhắn</span>
                          <div
                              onClick={() => {
                                  toggle();
                              }}
                              className={cx('close_btn')}
                          >
                              <CloseIcon />
                          </div>
                      </div>
                      <div className={cx('body')}>
                          <span className={cx('title')}>
                              Ai có thể gửi tin nhắn trực tiếp cho bạn
                          </span>
                          <p className={cx('sub_title')}>
                              Với bất kỳ tùy chọn nào, bạn có thể nhận tin nhắn
                              từ những người dùng mà bạn đã từng gửi tin nhắn
                              tới họ. Bạn bè là những follower của bạn mà bạn
                              follow ngược lại.
                          </p>
                      </div>
                  </div>
                  <div className={cx('overlay')}></div>
              </div>,
              document.body,
          )
        : null;
}

export default ModalSettingMessage;
