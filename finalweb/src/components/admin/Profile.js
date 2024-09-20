import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Make the API call with Axios
            const response = await axios.post('http://localhost:8000/api/auth/login', {
                email: 'admin@greenwich.com',
                password: '123123'
            });
            const storedData = localStorage.getItem('userTokenData');
            if(!storedData){
                localStorage.setItem('userTokenData', JSON.stringify(response.data));
                setData(JSON.parse(storedData));
            }
            // Handle the response data
            setData(response.data);
        } catch (err) {
            // Handle any errors
            setError(err.message);
        } finally {
            // Set loading to false
            setLoading(false);
        }
    };

    // Render the component based on state
    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error}</h1>;

    return (
        <div>
            <h1> {data && (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}</h1>
           
        </div>
    );
}

export default Profile;
