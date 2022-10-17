import classNames from 'classnames/bind';
import styles from './NavAccountItem.module.scss';

import SearchAccountItem from '~/components/SearchAccountItem';

const cx = classNames.bind(styles);

function NavAccountItem({ data }) {
    return <SearchAccountItem />;
}

export default NavAccountItem;
