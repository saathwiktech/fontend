import React, { createContext, useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        userId: null,
        name: '',
        email: '',
        currentProjectId: null,
        currentWorkId: null,
        Token: null,
        expiry: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const logs = localStorage.getItem('logs');
        const id = localStorage.getItem('id');
      
        if (token && logs === 'true') {
          setIsLoggedIn(true);
          
          setUser((prevUser) => ({
            ...prevUser,
            Token: token,        
            userId: id,        
          }));
        }
      }, []);
      


    const login = (decoded) => {
        localStorage.setItem('id', decoded.userId);
        localStorage.setItem('logs', true);
        setIsLoggedIn(true);
        navigate('/dashboard')
    };
    const logout = () => {
        setUser({
            userId: null,
            name: '',
            email: '',
            currentProjectId: null,
            currentWorkId: null,
            Token: null,
            expiry: null
        });
        localStorage.removeItem('token');
        localStorage.removeItem('logs');
        localStorage.removeItem('id');
        localStorage.removeItem('logs');
        // localStorage.setItem('logs', false);
        setIsLoggedIn(false);
        navigate('login')
    };

    const setuSerData = (data) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...data,
        }));
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setuSerData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
