import { createContext, useContext, useEffect, useState } from "react";
import { registerToast } from "../framework/services/toast-service";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

    const [toasts, setToasts] = useState([]);

    const showToast = (
        title,
        message,
        type = "success"
    ) => {

        const id = Date.now() + Math.random();

        const toast = {
            id,
            title,
            message,
            type
        };

        setToasts(prev => {

            const updated = [...prev, toast];

            return updated.slice(-3);
        });

        setTimeout(() => {

            // removeToast(id);

        }, 5000);
    };

    const removeToast = id => {

        setToasts(prev =>
            prev.filter(toast => toast.id !== id)
        );
    };

    useEffect(() => {

        registerToast(showToast);

    }, []);

    return (

        <ToastContext.Provider value={{ showToast }}>

            {children}

            <div
                className="toast-container position-fixed top-0 end-0 pt-5 pe-3"
                style={{
                    zIndex: 3000,
                    width: "380px",
                    maxWidth: "95vw"
                }}
            >

                {
                    toasts.map(toast => (

                        <div
                            key={toast.id}
                            className={`toast show text-bg-${toast.type} mb-2 shadow`}
                        >

                            <div className="toast-header">

                                <strong className="me-auto">

                                    {toast.title}

                                </strong>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => removeToast(toast.id)}
                                />

                            </div>

                            <div
                                className="toast-body"
                                style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word"
                                }}>
                                {toast.message}
                            </div>

                        </div>
                    ))
                }

            </div>

        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);