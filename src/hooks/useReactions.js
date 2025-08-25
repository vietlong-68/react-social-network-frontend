import { useState, useCallback, useEffect } from 'react';
import { addHeart, removeHeart, getHearts } from '../services/reactionService';

export const useReactions = (postId, initialIsLiked = false, initialLikeCount = 0) => {
    const [hearts, setHearts] = useState([]);
    const [currentUserHearted, setCurrentUserHearted] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        setCurrentUserHearted(initialIsLiked);
        setLikeCount(initialLikeCount);
    }, [initialIsLiked, initialLikeCount]);


    useEffect(() => {
        if (postId) {

            fetchHearts();
        }
    }, [postId]);

    const fetchHearts = useCallback(async () => {
        if (!postId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getHearts(postId);



            if (response && response.data) {
                const data = response.data;


                if (data.hearts) {
                    setHearts(data.hearts);
                }
                if (typeof data.currentUserHearted === 'boolean') {

                    setCurrentUserHearted(data.currentUserHearted);
                }
                if (data.totalHearts !== undefined) {

                    setLikeCount(data.totalHearts);
                }
            } else if (response) {



                if (response.hearts) {
                    setHearts(response.hearts);
                }
                if (typeof response.currentUserHearted === 'boolean') {

                    setCurrentUserHearted(response.currentUserHearted);
                }
                if (response.totalHearts !== undefined) {

                    setLikeCount(response.totalHearts);
                }
            }
        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    }, [postId]);

    const handleHeartClick = useCallback(async () => {
        if (!postId) return;

        try {
            setError(null);
            setLoading(true);

            if (currentUserHearted) {


                await removeHeart(postId);
                setCurrentUserHearted(false);
                setLikeCount(prev => Math.max(0, prev - 1));

            } else {


                try {
                    const newHeart = await addHeart(postId);
                    setCurrentUserHearted(true);
                    setLikeCount(prev => prev + 1);

                } catch (addError) {

                    if (addError.message && addError.message.includes('đã thả tin')) {

                        await fetchHearts();
                    } else {
                        throw addError;
                    }
                }
            }
        } catch (err) {
            setError(err.message);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [postId, currentUserHearted, fetchHearts]);

    const refreshHearts = useCallback(() => {
        fetchHearts();
    }, [fetchHearts]);

    return {
        hearts,
        currentUserHearted,
        likeCount,
        loading,
        error,
        fetchHearts,
        handleHeartClick,
        refreshHearts,
        setError
    };
};
