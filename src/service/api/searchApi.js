import axios from 'axios';
import { apiUrl } from '~/contexts/constants';

export const searchApi = async (debounced) => {
    try {
        const response = await axios.get(
            `${apiUrl}/search?q=${encodeURIComponent(debounced)}&type=less`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};
