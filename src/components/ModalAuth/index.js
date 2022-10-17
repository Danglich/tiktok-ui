import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import Button from '../Button';
import styles from './ModalAuth.module.scss';
import { useEffect, useState } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { useContext } from 'react';
import FormInput from '../FormInput';
import { notify } from '~/utils/toast';
import { awaitTimeout } from '~/utils/wait';
import ModalLoading from '../ModalLoading';

const cx = classNames.bind(styles);

function ModalAuth({ isShowing, toggle }) {
    let navigate = useNavigate();
    const { loginUser, registerUser } = useContext(AuthContext);
    const [disabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const [login, setLogin] = useState(true);
    const [formData, setFormData] = useState({
        nickname: '',
        password: '',
        confirmPassword: '',
        fullname: '',
    });
    const inputInvalid = document.querySelector('input:invalid');

    useEffect(() => {
        setDisabled(!!inputInvalid);
    }, [inputInvalid]);

    const inputs = [
        {
            id: 1,
            label: 'Họ và tên',
            type: 'text',
            placeholder: 'Họ và tên',
            name: 'fullname',
            pattern: '^.{2,30}$',
            errorMessage: 'Tối thiểu 2 ký tự và tối đa 30 ký tự',
            login: false,
            required: true,
        },
        {
            id: 2,
            label: 'Tên đăng nhập',
            type: 'text',
            placeholder: 'Tên đăng nhập',
            name: 'nickname',
            pattern: '^[A-Za-z0-9]{2,16}$',
            errorMessage: 'Từ 2-16 ký tự và không chứa ký tự đặc biệt',
            login: true,
            required: true,
        },
        {
            id: 3,
            label: 'Mật khẩu',
            type: 'password',
            placeholder: 'Mật khẩu',
            name: 'password',
            pattern: '^(?=.*?[A-Z])[A-Za-z0-9]{6,}$',
            errorMessage: 'Ít nhất 6 ký tự và ít nhất 1 chữ cái in hoa',
            login: true,
            required: true,
        },
    ];

    const handleChangeFormData = (e) => {
        const target = e.target;
        setFormData({ ...formData, [target.name]: target.value });
    };

    const { fullname, nickname, password } = formData;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = {
            nickname: nickname,
            password: password,
        };

        try {
            const result = await loginUser(formData);

            if (result.success) {
                setError('');
                toggle();
                setFormData({
                    nickname: '',
                    password: '',
                    confirmPassword: '',
                    fullname: '',
                });
                setIsLoading(false);
                notify('Đăng nhập thành công!', 'success');
                await awaitTimeout(700);
                navigate('/', { replace: true });
            } else {
                setIsLoading(false);
                setError(result.message);
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = {
            nickname: nickname,
            fullname: fullname,
            password: password,

            //repassword: rePassword,
        };

        try {
            const result = await registerUser(formData);

            if (result.success) {
                setError('');
                toggle();
                setFormData({
                    nickname: '',
                    password: '',
                    confirmPassword: '',
                    fullname: '',
                });
                setIsLoading(false);
                notify('Đăng ký thành công!', 'success');
                await awaitTimeout(700);

                navigate('/', { replace: true });
            } else {
                setIsLoading(false);
                setError(result.message);
                setFormData({
                    ...formData,
                    nickname: '',
                    password: '',
                    confirmPassword: '',
                });
                setDisabled(true);
            }
        } catch (error) {
            setIsLoading(false);
            setDisabled(true);
        }
    };

    const handleClose = () => {
        setError('');
        setFormData({
            fullname: '',
            nickname: '',
            password: '',
            confirmPassword: '',
        });
        toggle();
    };

    if (isLoading) {
        return <ModalLoading />;
    }

    return isShowing
        ? ReactDOM.createPortal(
              <div className={cx('modal')}>
                  <div className={cx('content')}>
                      <div className={cx('header')}>
                          <h2 className={cx('title')}>
                              {login
                                  ? 'Đăng nhập vào TikTok'
                                  : 'Đăng ký TikTok'}
                          </h2>
                          <span className={cx('error')}>{error}</span>
                      </div>
                      <div className={cx('body')}>
                          <form>
                              {inputs.map((input) => {
                                  if (login) {
                                      if (input.login)
                                          return (
                                              <FormInput
                                                  {...input}
                                                  errorMessage={''}
                                                  key={input.id}
                                                  login={input.login.toString()}
                                                  onChange={
                                                      handleChangeFormData
                                                  }
                                                  value={formData[input.name]}
                                              />
                                          );
                                  } else {
                                      return (
                                          <FormInput
                                              {...input}
                                              key={input.id}
                                              login={input.login.toString()}
                                              onChange={handleChangeFormData}
                                              value={formData[input.name]}
                                          />
                                      );
                                  }
                                  return null;
                              })}

                              {login && (
                                  <Button
                                      onClick={(e) => handleLogin(e)}
                                      primary
                                  >
                                      Đăng Nhập
                                  </Button>
                              )}
                              {!login && (
                                  <Button
                                      onClick={(e) => {
                                          handleRegister(e);
                                      }}
                                      primary
                                      disabled={disabled}
                                  >
                                      Đăng Ký
                                  </Button>
                              )}
                          </form>
                      </div>
                      {login && (
                          <div className={cx('footer')}>
                              <span className={cx('title')}>
                                  Bạn chưa có tài khoản?
                              </span>
                              <span
                                  onClick={() => {
                                      setError('');
                                      setLogin(false);
                                      setFormData({
                                          nickname: '',
                                          password: '',
                                          confirmPassword: '',
                                          fullname: '',
                                      });
                                  }}
                                  className={cx('link')}
                              >
                                  Đăng ký
                              </span>
                          </div>
                      )}

                      {!login && (
                          <div className={cx('footer')}>
                              <span className={cx('title')}>
                                  Bạn đã có tài khoản?
                              </span>
                              <span
                                  onClick={() => {
                                      setError('');
                                      setLogin(true);
                                      setFormData({
                                          nickname: '',
                                          password: '',
                                          confirmPassword: '',
                                          fullname: '',
                                      });
                                  }}
                                  className={cx('link')}
                              >
                                  Đăng nhập
                              </span>
                          </div>
                      )}

                      <div onClick={handleClose} className={cx('close')}>
                          <FontAwesomeIcon icon={faClose} />
                      </div>
                  </div>
              </div>,
              document.body,
          )
        : null;
}

export default ModalAuth;
