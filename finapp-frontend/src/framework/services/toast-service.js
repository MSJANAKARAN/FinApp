let toastFunction = null;

export const registerToast = (fn) => {
    toastFunction = fn;
};

export const showToast = (title, message, type) => {
    if (toastFunction) {
        toastFunction(title, message, type);
    }
};