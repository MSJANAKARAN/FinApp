const AuthService = {

    saveToken(token){

        localStorage.setItem(
            "token",
            token
        );
    },

    getToken(){

        return localStorage.getItem(
            "token"
        );
    },

    logout(){

        localStorage.removeItem(
            "token"
        );
    },

    isLoggedIn(){

        return !!localStorage.getItem(
            "token"
        );
    }
};

export default AuthService;