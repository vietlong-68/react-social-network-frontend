import { useState, useEffect, useCallback } from 'react';
import { getTopHashtags } from '../services/hashtagService';


export const useHashtags = () => {
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchHashtags = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);


            const data = await getTopHashtags();


            setHashtags(data || []);
        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    }, []);


    const refreshHashtags = useCallback(() => {

        fetchHashtags();
    }, [fetchHashtags]);


    useEffect(() => {

        fetchHashtags();
    }, [fetchHashtags]);

    return {
        hashtags,
        loading,
        error,
        refreshHashtags,
        setError
    };
};
