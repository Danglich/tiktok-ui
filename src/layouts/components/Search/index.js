import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TippyHeadless from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import styles from './Search.module.scss';
import SearchAccountItem from '~/components/SearchAccountItem';
import Popper from '~/components/Popper';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { LoadingIcon, SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';
import axios from 'axios';
import { apiUrl } from '~/contexts/constants';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showResults, setShowResults] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(searchValue, 500);

    useEffect(() => {
        let ignore = false;
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }
        setLoading(true);

        const fetchData = async () => {
            const result = await axios.get(
                `${apiUrl}/search/user?q=${encodeURIComponent(
                    debounced,
                )}&type=less`,
            );
            if (!ignore) {
                setSearchResult(result.data);
                setLoading(false);
            }
        };

        fetchData();
        return () => {
            ignore = true;
        };
    }, [debounced]);

    const inputRef = useRef();

    const handleChangeInput = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
        setSearchResult([]);
    };

    const handleOutside = () => {
        setShowResults(false);
    };

    const navigate = useNavigate();

    return (
        <div className={cx('wrap-search')}>
            <TippyHeadless
                interactive
                visible={showResults && searchResult.length > 0}
                render={() => (
                    <div className={cx('search-result')}>
                        <Popper>
                            <div className={cx('header')}>
                                <span className={cx('title')}>Tài khoản</span>
                            </div>
                            {searchResult.map((result) => (
                                <SearchAccountItem
                                    key={result.id}
                                    data={result}
                                />
                            ))}
                        </Popper>
                    </div>
                )}
                onClickOutside={handleOutside}
            >
                <form
                    className={cx('search')}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (searchValue) {
                            setShowResults(false);
                            navigate(`/search?q=${searchValue}`, {
                                replace: true,
                            });
                        }
                    }}
                >
                    <input
                        type="text"
                        className={cx('search-input')}
                        ref={inputRef}
                        value={searchValue}
                        spellCheck={false}
                        onFocus={() => {
                            setShowResults(true);
                        }}
                        onChange={handleChangeInput}
                        placeholder={'Tìm kiếm tài khoản và video'}
                    ></input>

                    {!loading && searchValue && (
                        <div onClick={handleClear} className={cx('clear')}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    )}
                    {loading && (
                        <div className={cx('loadding')}>
                            <LoadingIcon />
                        </div>
                    )}
                    <button
                        className={cx('search-btn')}
                        onMouseDown={(e) => {
                            //e.preventDefault();
                        }}
                        onClick={() => {
                            if (searchValue) {
                                setShowResults(false);
                                navigate(`/search?q=${searchValue}`, {
                                    replace: true,
                                });
                            }
                        }}
                        type="submit"
                    >
                        <SearchIcon width={'24'} height={'24'} />
                    </button>
                </form>
            </TippyHeadless>
        </div>
    );
}

export default Search;
