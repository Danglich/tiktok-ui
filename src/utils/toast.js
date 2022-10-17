import { toast } from 'react-toastify';

export const notify = (message, status) => {
    if (status === 'success') {
        return toast.success(message, {
            position: 'top-right',
            autoClose: 800,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }
    if (status === 'error') {
        return toast.error(message, {
            position: 'top-right',
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }
};
