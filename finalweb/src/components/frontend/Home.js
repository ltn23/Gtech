import React, { useEffect, useState } from "react";



function Home () {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        setTimeout(() => {
            setLoading(false);
            const role = localStorage.getItem("role");
            if (role === "admin") {
             window.location.href = "/dashboard";
            }
        }, 1000);
    
    
    }, []);
    
    return (
        <div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "100vh" }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div>
            
                </div>
            )}
        </div>
    );
}

export default Home;
 