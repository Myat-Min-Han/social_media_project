import getToken from '../helpers/getToken';
import axios from '../config/axios'

const postPostLike = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to like post")
        };
        throw new Error("Unexpected error occured")
    }
};

const postCommentLike = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to like comment")
        };
        throw new Error("Unexpected error occured") 
    }
};

const deletePostLike = async (url: string ) => {
    try {
        const token = getToken();

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to unlike post")
        };

        throw new Error("Unexpected error occured")
    }
};

const deleteCommentLike = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to unlike comment")
        };

        throw new Error("Unexpected error occured")
    }
}

const fetchPostLikes = async (url: string ) => {
    try {

        const response = await axios.get(url);
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to fetch post likes")
        };
        throw new Error("Unexpected error occcured")
    }
}

const fetchCommentLikes = async (url: string ) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to fetch comment likes")
        };
        throw new Error("Unexpected error occcured")
    }
};

const postFollow = async (url: string) => {
    try {
        const token = getToken();

        const response = await axios.post(url, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

        return response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "failed to follow the user")
        }
        throw new Error("Unexpected error occured")
    }
};

const deleteFollow = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || " failed to unfollow the user")
        }
    }
};

const fetchSearch = async (url: string, { arg }: { arg: string}) => {
    try {
        const response = await axios.get(`${url}?q=${arg}`);
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'failed to search the user')
        };
        throw new Error('Unexpected error occured')
    }
};

const fetchFollowingPosts = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Cannot fetch the posts")
        };

        throw new Error("Unexpected error occured")
    }
};

const fetchNotis = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(e) {
        throw new Error((e as Error).message)
    }
};

const putAllNotisRead = async (url: string) => {
    try {
        const token = getToken();
        const response = await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(e) {
        throw new Error((e as Error).message)
    }
};

const putNotiRead = async (url: string, { arg }: { arg: string }) => {
    try {
        const token = getToken();
        const response = await axios.put(`${url}/${arg}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch(e) {
        throw new Error((e as Error).message)
    }
}

export { 
    postPostLike, postCommentLike,
    deletePostLike,deleteCommentLike,
    fetchPostLikes, fetchCommentLikes,
    postFollow, deleteFollow,
    fetchSearch, fetchFollowingPosts,
    fetchNotis, putAllNotisRead, putNotiRead
}