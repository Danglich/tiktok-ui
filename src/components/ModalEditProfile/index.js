import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '~/contexts/constants';
import setAuthToken from '~/utils/setAuthToken';
import Button from '../Button';
import { CloseIcon, EditIcon, TichIcon } from '../Icons';
import styles from './ModalEditProfile.module.scss';
import cloudinary from '~/utils/cloudinary';
import { useDebounce } from '~/hooks';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    getStorage,
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import storage from '~/firebase/storage';

const cx = classNames.bind(styles);

function ModalEditProfile({ isShowing, toggle, data }) {
    const user = data;
    const avatarUrl = user.avatar;
    const avatarId = avatarUrl.slice(61, -4);

    const [errorBio, setErrorBio] = useState(false);
    const [errorFullName, setErrorFullName] = useState(false);
    const [errorFormatNickname, setErrorFormatNickname] = useState(false);
    const [errorMinLengthNickname, setErrorMinLengthNickname] = useState(false);
    const [errorMaxLengthNickname, setErrorMaxLengthNickname] = useState(false);
    const [errorHadNickname, setErrorHadNickname] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [tick, setTick] = useState(false);

    const limitLengthOfBio = 80;
    const limitLengthOfFullName = 30;
    const letLengthOfNickName = 2;

    const formatNickName = /^[A-Za-z0-9]*$/;
    const formatNickName2 = /[^\x00-\x7F]/;
    const [currentAvatarId, setCurrentAvatarId] = useState(null);

    const initFormState = useMemo(() => {
        return {
            avatar: user.avatar,
            nickname: user.nickname,
            fullname: user.fullname,
            bio: user.bio || '',
        };
    }, []);

    //upload
    const [isUploading, setIsUploading] = useState(false);

    const notify = () => {
        toast(' Update th??nh c??ng! ????????????', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const [formState, setFormState] = useState(initFormState);

    const debounced = useDebounce(formState.nickname, 600);

    const errorStringNickname =
        errorFormatNickname || errorMinLengthNickname || errorMaxLengthNickname;

    useEffect(() => {
        const handleCheckNickname = async () => {
            try {
                setIsChecking(true);
                const result = await axios.post(`${apiUrl}/user/check`, {
                    nickname: debounced,
                });
                if (result.data.success) {
                    setErrorHadNickname(false);
                    setTick(true);
                } else {
                    setErrorHadNickname(true);
                    setTick(false);
                }
                setIsChecking(false);
            } catch (error) {
                console.log(error);
                setIsChecking(false);
                setTick(false);
            }
        };

        if (debounced !== initFormState.nickname && !errorStringNickname) {
            handleCheckNickname();
        }
    }, [debounced, initFormState.nickname, errorStringNickname]);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (formState.bio.length > limitLengthOfBio) {
                setErrorBio(true);
            }
            if (formState.bio.length <= limitLengthOfBio) {
                setErrorBio(false);
            }

            if (formState.fullname.length > limitLengthOfFullName) {
                setErrorFullName(true);
            }
            if (formState.fullname.length <= limitLengthOfFullName) {
                setErrorFullName(false);
            }
            if (
                !formatNickName.test(formState.nickname) ||
                formatNickName2.test(formState.nickname)
            ) {
                setErrorFormatNickname(true);
            }
            if (
                formatNickName.test(formState.nickname) &&
                !formatNickName2.test(formState.nickname)
            ) {
                setErrorFormatNickname(false);
            }
            if (formState.nickname.length < letLengthOfNickName) {
                setErrorMinLengthNickname(true);
            }
            if (formState.nickname.length >= letLengthOfNickName) {
                setErrorMinLengthNickname(false);
            }
            if (formState.nickname.length > 24) {
                setErrorMaxLengthNickname(true);
            }
            if (formState.nickname.length <= 24) {
                setErrorMaxLengthNickname(false);
            }
        }

        return () => (isSubscribed = false);
    }, [formState, formatNickName2, formatNickName]);

    const disable =
        JSON.stringify(initFormState) === JSON.stringify(formState) ||
        errorBio ||
        errorFullName ||
        errorFormatNickname ||
        errorMinLengthNickname ||
        errorMaxLengthNickname ||
        errorHadNickname ||
        isChecking;

    const errorNickname =
        errorFormatNickname ||
        errorMinLengthNickname ||
        errorMaxLengthNickname ||
        errorHadNickname;

    const handleChangForm = (e) => {
        const target = e.target;
        setFormState({ ...formState, [target.name]: target.value });

        //Kh??ng cho ch???a d???u c??ch ?????u
        // if(target.name === 'nickname') {
        //     setFormState({...formState, [target.name] : target.value.trim()});
        // }
    };

    const upload = (file) => {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage();
        const storageRef = ref(storage, `images/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setIsUploading(true);
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormState({ ...formState, avatar: downloadURL });
                });
                setIsUploading(false);
                setCurrentAvatarId(fileName);
            },
        );
    };

    const deleteFile = (fileName) => {
        const storage = getStorage();

        // Create a reference to the file to delete
        const desertRef = ref(storage, `images/${currentAvatarId}`);

        // Delete the file
        deleteObject(desertRef)
            .then(() => {
                console.log('???? x??a th??nh c??ng');
            })
            .catch((error) => {
                // Uh-oh, an error occurred!
            });
    };

    const handleChangeFile = (e) => {
        upload(e.target.files[0]);
    };

    const deleteImage = async (currentId) => {
        try {
            const result = await cloudinary.uploader.destroy(
                currentId,
                function (result) {},
                {
                    resource_type: 'image',
                },
            );

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancle = async () => {
        //await deleteImage(currentAvatarId ? currentAvatarId : 'hehe');
        deleteFile();
        setFormState(initFormState);
    };

    const handleSubmit = async () => {
        await axios.post(`${apiUrl}/user/update`, formState);
        if (user.avatar !== formState.avatar) {
            deleteImage(avatarId);
        }
        toggle();
        notify();
        window.location.reload(false);
    };

    return isShowing
        ? ReactDOM.createPortal(
              <div className={cx('modal')}>
                  <div className={cx('content')}>
                      <div className={cx('header')}>
                          <span className={cx('title')}>S???a h??? s??</span>
                          <div
                              onClick={() => {
                                  toggle();
                                  handleCancle();
                              }}
                              className={cx('close_btn')}
                          >
                              <CloseIcon />
                          </div>
                      </div>
                      <div className={cx('body')}>
                          <div className={cx('body_item')}>
                              <div className={cx('edit_avatar')}>
                                  <span className={cx('title')}>???nh h??? s??</span>
                                  <label htmlFor="avatar_input">
                                      <div
                                          className={cx('avatar')}
                                          style={{
                                              backgroundImage: `url(${formState.avatar})`,
                                          }}
                                      ></div>
                                      <div className={cx('icon')}>
                                          <EditIcon />
                                      </div>
                                  </label>
                                  <input
                                      onChange={handleChangeFile}
                                      id="avatar_input"
                                      className={cx('avatar_input')}
                                      type="file"
                                      accept="image/png, image/jpeg"
                                  ></input>
                              </div>
                          </div>
                          <div className={cx('body_item')}>
                              <div
                                  className={cx('edit_id', {
                                      error: errorNickname,
                                  })}
                              >
                                  <span className={cx('title')}>Tiktok ID</span>
                                  <div className={cx('wrapper')}>
                                      <input
                                          placeholder="Tiktok ID"
                                          name="nickname"
                                          type="text"
                                          className={cx('input_text')}
                                          value={formState.nickname}
                                          onChange={(e) => {
                                              handleChangForm(e);
                                          }}
                                      ></input>
                                      {errorMinLengthNickname && (
                                          <span className={cx('error_message')}>
                                              T???i thi???u 2 k?? t???
                                          </span>
                                      )}
                                      {errorMaxLengthNickname && (
                                          <span className={cx('error_message')}>
                                              T???i ??a 24 k?? t???
                                          </span>
                                      )}
                                      {!errorMaxLengthNickname &&
                                          !errorMinLengthNickname &&
                                          errorFormatNickname && (
                                              <span
                                                  className={cx(
                                                      'error_message',
                                                  )}
                                              >
                                                  Kh??ng th??? s??? d???ng TikTok ID
                                                  n??y. Vui l??ng nh???p TikTok ID
                                                  m???i.
                                              </span>
                                          )}
                                      {!errorMaxLengthNickname &&
                                          !errorMinLengthNickname &&
                                          !errorFormatNickname &&
                                          errorHadNickname && (
                                              <span
                                                  className={cx(
                                                      'error_message',
                                                  )}
                                              >
                                                  Kh??ng th??? s??? d???ng TikTok ID
                                                  n??y. Vui l??ng nh???p TikTok ID
                                                  m???i.
                                              </span>
                                          )}
                                      <span className={cx('sub_title')}>
                                          www.tiktok.com/@{formState.nickname}
                                      </span>
                                      <span className={cx('sub_title')}>
                                          TikTok ID ch??? c?? th??? bao g???m ch??? c??i,
                                          ch??? s???, d???u g???ch d?????i v?? d???u ch???m. Khi
                                          thay ?????i TikTok ID, li??n k???t h??? s?? c???a
                                          b???n c??ng s??? thay ?????i.
                                      </span>
                                      {isChecking && (
                                          <div className={cx('spinner')}></div>
                                      )}
                                      {!isChecking && !errorNickname && tick && (
                                          <div className={cx('tick_icon')}>
                                              <TichIcon />
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <div className={cx('body_item')}>
                              <div
                                  className={cx('edit_name', {
                                      error: errorFullName,
                                  })}
                              >
                                  <span className={cx('title')}>T??n</span>
                                  <div className={cx('wrapper')}>
                                      <input
                                          placeholder="T??n"
                                          name="fullname"
                                          type="text"
                                          className={cx('input_text')}
                                          value={formState.fullname}
                                          onChange={(e) => {
                                              handleChangForm(e);
                                          }}
                                      ></input>
                                      {errorFullName && (
                                          <span className={cx('error_message')}>
                                              T???i ??a 30 k?? t???.
                                          </span>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <div>
                              <div
                                  className={cx('edit_bio', {
                                      error: errorBio,
                                  })}
                              >
                                  <span className={cx('title')}>Ti???u s???</span>
                                  <div className={cx('wrapper')}>
                                      <textarea
                                          name="bio"
                                          placeholder="Ti???u s???"
                                          type="text"
                                          className={cx('input_bio')}
                                          value={formState.bio || ''}
                                          onChange={(e) => {
                                              handleChangForm(e);
                                          }}
                                      ></textarea>
                                      <div className={cx('chars')}>
                                          <span
                                              className={cx('quantity_chars')}
                                          >
                                              {formState.bio.length}
                                          </span>
                                          /
                                          <span className={cx('total_chars')}>
                                              {limitLengthOfBio}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className={cx('footer')}>
                          <Button
                              borderDefault
                              onClick={() => {
                                  toggle();
                                  handleCancle();
                              }}
                          >
                              H???y
                          </Button>
                          <Button
                              borderDefault={disable}
                              primary={!disable}
                              disabled={disable}
                              onClick={handleSubmit}
                          >
                              L??u
                          </Button>
                      </div>
                  </div>
                  <div className={cx('overlay')}></div>

                  {isUploading && (
                      <div className={cx('modal-loading')}>
                          <div className={cx('spinner-loading')}></div>
                          <span className={cx('title')}>??ang upload ...</span>
                      </div>
                  )}
              </div>,
              document.body,
          )
        : null;
}

export default ModalEditProfile;
