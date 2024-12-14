
const getToken = (): string | null => {
    const token = localStorage.getItem("token");

    return token;
};

export default getToken;