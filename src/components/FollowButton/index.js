import axios from 'axios';
import { useEffect } from 'react';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { apiUrl } from '~/contexts/constants';
import useModal from '~/hooks/useModal';
import Button from '../Button';
import ModalAuth from '../ModalAuth';

function FollowButton({ userid, nickname, onClick, children, ...props }) {
    const { authState } = useContext(AuthContext);
    const user = authState.user;
    const [isFollow, setIsFollow] = useState();
    const { isShowing, toggle } = useModal();

    useEffect(() => {
        if (user && userid) {
            setIsFollow(user.followings.includes(userid));
        }
    }, [user, userid]);

    const handleOnClick = async (e) => {
        if (onClick) {
            onClick();
        }
        e.stopPropagation();
        e.preventDefault();
        await axios.put(`${apiUrl}/user/${nickname}`);
        setIsFollow(!isFollow);
    };

    if (!user) {
        return (
            <>
                <Button {...props} onClick={toggle}>
                    Follow
                </Button>
                <ModalAuth isShowing={isShowing} toggle={toggle} />
            </>
        );
    }

    return !children ? (
        <>
            <Button
                {...props}
                onClick={(e) => {
                    handleOnClick(e);
                }}
            >
                {isFollow ? 'Bỏ follow' : 'Follow'}
            </Button>
        </>
    ) : (
        <>
            <div
                onClick={(e) => {
                    handleOnClick(e);
                }}
            >
                {children}
            </div>
        </>
    );
}

export default FollowButton;
