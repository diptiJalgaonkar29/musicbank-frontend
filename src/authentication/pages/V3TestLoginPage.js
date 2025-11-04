import React, { useContext } from 'react'
import LoginForm from '../components/Login/LoginForm/LoginForm'
import { BrandingContext } from '../../branding/provider/BrandingContext';
import { useNavigate } from 'react-router-dom';

export default function V3TestLoginPage() {
    const { config, messages, osContext, osToken } = useContext(BrandingContext);
    let navigate = useNavigate()
    return (
        <div style={
            {
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }
        }>
            <LoginForm
                navigate={navigate}
                loginMessages={messages?.auth?.login?.page}
            />
        </div>
    )
}
