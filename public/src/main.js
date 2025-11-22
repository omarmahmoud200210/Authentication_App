const refreshAuth = async () => {
    const res = await fetch("/refresh", { method: "get", credentials: "include"});
    if (!res.ok) throw new Error("Failed to refresh the access token");
};

const checkAuth = async () => { 
    const response = await fetch("/dashboard", { method: 'get', credentials: "include"});

    if (response.status === 403) {
        await refreshAuth();
        return;
    }

    if (response.status === 401) return;
}

checkAuth();