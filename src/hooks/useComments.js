import { useState, useCallback } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../services/commentService';

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = useCallback(async (page = 0) => {
        if (!postId) {

            return;
        }

        try {

            setLoading(true);
            setError(null);

            const response = await getComments(postId, page);



            const pageData = response.data || response;


            if (page === 0) {
                setComments(pageData.content || []);
            } else {
                setComments(prev => [...prev, ...(pageData.content || [])]);
            }

            setCurrentPage(page);

            setHasMore(!pageData.last);


        } catch (err) {

            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const addComment = useCallback(async (content) => {
        if (!postId) {

            return;
        }

        if (!content || !content.trim()) {

            return;
        }

        try {

            setError(null);

            const newComment = await createComment(postId, content);



            const commentData = newComment.data || newComment;



            const completeComment = {
                id: commentData.id || `temp-${Date.now()}`,
                content: content,
                user: {
                    id: commentData.user?.id || commentData.userId,
                    firstName: commentData.user?.firstName || commentData.userFirstName,
                    lastName: commentData.user?.lastName || commentData.userLastName,
                    profilePictureUrl: commentData.user?.profilePictureUrl || commentData.userProfilePicture
                },
                postId: postId,
                createdAt: commentData.createdAt || new Date().toISOString(),
                updatedAt: commentData.updatedAt || new Date().toISOString()
            };




            setComments(prev => {
                const newComments = [completeComment, ...prev];

                return newComments;
            });


            return completeComment;
        } catch (err) {

            setError(err.message);
            throw err;
        }
    }, [postId]);

    const updateCommentById = useCallback(async (commentId, content) => {
        if (!commentId || !content) {

            return;
        }

        try {

            setError(null);

            const updatedComment = await updateComment(commentId, content);



            const commentData = updatedComment.data || updatedComment;


            setComments(prev => {
                const newComments = prev.map(comment =>
                    comment.id === commentId ? commentData : comment
                );

                return newComments;
            });


            return commentData;
        } catch (err) {

            setError(err.message);
            throw err;
        }
    }, []);

    const deleteCommentById = useCallback(async (commentId) => {
        if (!commentId) {

            return;
        }

        try {

            setError(null);

            await deleteComment(commentId);


            setComments(prev => {
                const newComments = prev.filter(comment => comment.id !== commentId);

                return newComments;
            });


        } catch (err) {

            setError(err.message);
            throw err;
        }
    }, []);

    const refreshComments = useCallback(() => {

        fetchComments(0);
    }, [fetchComments, postId]);

    const loadMoreComments = useCallback(() => {
        if (hasMore && !loading) {

            fetchComments(currentPage + 1);
        } else {

        }
    }, [hasMore, loading, currentPage, fetchComments, postId]);

    return {
        comments,
        loading,
        error,
        currentPage,
        hasMore,
        fetchComments,
        addComment,
        updateCommentById,
        deleteCommentById,
        refreshComments,
        loadMoreComments,
        setError
    };
};
