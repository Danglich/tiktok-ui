import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <div className={cx('logo', 'element')}>
                        <img src={images.logo_white} alt={'Logo'} />
                    </div>
                    <div className={cx('company', 'element')}>
                        <a href="/" className={cx('title')}>
                            Công ty
                        </a>
                        <a href="/" className={cx('link')}>
                            Giới thiệu
                        </a>
                        <a href="/" className={cx('link')}>
                            Bảng tin
                        </a>
                        <a href="/" className={cx('link')}>
                            Liên hệ
                        </a>
                        <a href="/" className={cx('link')}>
                            Sự nghiệp
                        </a>
                        <a href="/" className={cx('link')}>
                            ByteDance
                        </a>
                    </div>
                    <div className={cx('program', 'element')}>
                        <a href="/" className={cx('title')}>
                            Chương trình
                        </a>
                        <a href="/" className={cx('link')}>
                            TikTok for Good
                        </a>
                        <a href="/" className={cx('link')}>
                            Quảng cáo
                        </a>
                        <a href="/" className={cx('link')}>
                            Developers
                        </a>
                        <a href="/" className={cx('link')}>
                            TikTok Rewards
                        </a>
                    </div>
                    <div className={cx('help', 'element')}>
                        <a href="/" className={cx('title')}>
                            Hỗ trợ
                        </a>
                        <a href="/" className={cx('link')}>
                            Trung tâm hỗ trợ
                        </a>
                        <a href="/" className={cx('link')}>
                            Trung tâm an toàn
                        </a>
                        <a href="/" className={cx('link')}>
                            Creator Portal
                        </a>
                        <a href="/" className={cx('link')}>
                            Hướng dẫn cộng đồng
                        </a>
                        <a href="/" className={cx('link')}>
                            Minh bạch
                        </a>
                    </div>
                    <div className={cx('juridical', 'element')}>
                        <a href="/" className={cx('title')}>
                            Pháp lý
                        </a>
                        <a href="/" className={cx('link')}>
                            Terms of Use
                        </a>
                        <a href="/" className={cx('link')}>
                            Privacy Policy
                        </a>
                        <a href="/" className={cx('link')}>
                            Trung tâm thực thi pháp luật của TikTok
                        </a>
                    </div>
                </div>

                <div className={cx('footer')}>
                    <select className={cx('language')} defaultValue={'Tiếng Việt'}>
                        <option>Tiếng Việt</option>
                        <option>English</option>
                    </select>
                    <div className={cx('copyright')}>
                        <span>© 2022 TikTok</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
