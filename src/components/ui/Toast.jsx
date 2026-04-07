import { useState, useEffect } from "react";

export default function Toast({ toast }) {
    const [activeToast, setActiveToast] = useState(null);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (toast) {
            setActiveToast(toast);
            setIsExiting(false);
            const exitTimer = setTimeout(() => setIsExiting(true), 2700);
            const clearTimer = setTimeout(() => setActiveToast(null), 3000);
            return () => {
                clearTimeout(exitTimer);
                clearTimeout(clearTimer);
            };
        }
    }, [toast]);

    if (!activeToast) return null;

    const Icon = () => {
        if (activeToast.type === "ok") return "✅";
        if (activeToast.type === "warn") return "⚠️";
        if (activeToast.type === "danger") return "❌";
        return "ℹ️";
    };

    return (
        <div className="toast-container">
            <div className={`toast ${activeToast.type} ${isExiting ? "exit" : ""}`}>
                <Icon />
                <span>{activeToast.msg}</span>
            </div>
        </div>
    );
}
