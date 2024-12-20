import { useState, useEffect, useContext } from 'react';

import { UserContext } from '@/providers/UserProvider';
import { PetContext } from '@/providers/PetProvider';

import { getItemFromLocalStorage, setItemsInLocalStorage, removeItemFromLocalStorage } from '@/utils';
import axiosInstance from '@/utils/axios';

// USER
export const useAuth = () => {
    return useContext(UserContext)
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = getItemFromLocalStorage('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    }, [])

    const register = async (formData) => {
        const { name, email, password } = formData;

        try {
            const { data } = await axiosInstance.post('user/register', {
                name,
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Registration successfull' }
        } catch (error) {
            const { message } = error.response.data
            return { success: false, message }
        }
    }

    const login = async (formData) => {
        const { email, password } = formData;

        try {
            const { data } = await axiosInstance.post('user/login', {
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successfull' }
        } catch (error) {
            const { message } = error.response.data
            return { success: false, message }
        }
    }

    

    const logout = async () => {
        try {
            const { data } = await axiosInstance.get('/user/logout');
            if (data.success) {
                setUser(null);

                // Clear user data and token from localStorage when logging out
                removeItemFromLocalStorage('user');
                removeItemFromLocalStorage('token');
            }
            return { success: true, message: 'Logout successfull' }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Something went wrong!' }
        }
    }

    const uploadPicture = async (picture) => {
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const { data } = await axiosInstance.post('/user/upload-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const updateUser = async (userDetails) => {
        const { name, password, picture } = userDetails;
        const email = JSON.parse(getItemFromLocalStorage('user')).email
        try {
            const { data } = await axiosInstance.put('/user/update-user', {
                name, password, email, picture
            })
            return data;
        } catch (error) {
            console.log(error)
        }
    }


    return {
        user,
        setUser,
        register,
        login,
        
        logout,
        loading,
        uploadPicture,
        updateUser
    }
}


// PLACES
export const usePets = () => {
    return useContext(PetContext)
}

export const useProvidePets = () => {
    const [pets, setPet] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPets = async () => {
        const { data } = await axiosInstance.get('/pet');
        setPet(data.pet);
        setLoading(false);
    };

    useEffect(() => {
        getPets();
    }, [])

    return {
        pets,
        setPet,
        loading,
        setLoading
    }
}