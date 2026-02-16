export default function PortfolioLoading() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background, #030310)",
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    border: "3px solid rgba(99, 102, 241, 0.2)",
                    borderTopColor: "#6366f1",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
