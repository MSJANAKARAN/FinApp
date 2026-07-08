import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState({
        show: false,
        title: "",
        message: "",
        type: "success"
    });

    const showToast = (
        title,
        message,
        type = "success"
    ) => {

        setToast({
            show: true,
            title,
            message,
            type
        });

        setTimeout(() => {
            setToast(prev => ({
                ...prev,
                show: false
            }));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>

            {children}

            <div
                className="toast-container position-fixed top-0 end-0 pt-5 pe-3"
                style={{ zIndex: 3000 }}
            >

                <div
                    className={`toast text-bg-${toast.type} ${toast.show ? "show" : "hide"}`}
                >
                    <div className="toast-header">

                        <strong className="me-auto">
                            {toast.title}
                        </strong>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() =>
                                setToast(prev => ({
                                    ...prev,
                                    show: false
                                }))
                            }
                        />

                    </div>

                    <div className="toast-body">
                        {toast.message}
                    </div>

                </div>

            </div>

        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);