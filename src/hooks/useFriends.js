import { useState, useEffect, useCallback } from 'react';
import { getFriendsList } from '../services/friendshipService';


export const useFriends = (limit = 10) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);


    const fetchFriends = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);


            const response = await getFriendsList(page, limit);



            if (response && response.content) {



                const mappedFriends = response.content.map(friendResponse => ({
                    ...friendResponse.friend,
                    friendshipId: friendResponse.id,
                    acceptedAt: friendResponse.acceptedAt
                }));



                if (page === 1) {
                    setFriends(mappedFriends);
                } else {
                    setFriends(prev => [...prev, ...mappedFriends]);
                }

                setHasMore(!response.last);
            } else if (Array.isArray(response)) {

                setFriends(response);
                setHasMore(false);
            } else {
                setFriends([]);
                setHasMore(false);
            }
        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    }, [limit]);


    const refreshFriends = useCallback(() => {

        fetchFriends(1);
    }, [fetchFriends]);


    const loadMoreFriends = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = Math.floor(friends.length / limit) + 1;

            fetchFriends(nextPage);
        }
    }, [loading, hasMore, friends.length, limit, fetchFriends]);


    useEffect(() => {

        fetchFriends(1);
    }, [fetchFriends]);

    return {
        friends,
        loading,
        error,
        hasMore,
        fetchFriends,
        refreshFriends,
        loadMoreFriends,
        setError
    };
};
