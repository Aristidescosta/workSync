import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from "lucide-react"

import {
    Form
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthenticationSchema, createEmailAccountSchema } from '@/src/schemas'
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserSessionStore } from '@/src/hooks'
import { useToastMessage } from '@/react-toastify'
import { useState } from 'react'
import { FormAuth } from '@/src/enums/FormAuth'
import { LoginForm, SignUpForm } from './components/forms'

export const AuthenticationPage = () => {
    const { toastMessage, ToastStatus, } = useToastMessage();
    const signInWithGoogle = useUserSessionStore(state => state.signInWithGoogle)
    const signInWithEmailAndPassword = useUserSessionStore(state => state.signInWithEmailAndPassword)
    const setUserEmail = useUserSessionStore(state => state.setUserEmail)
    const setUserPassword = useUserSessionStore(state => state.setUserPassword)
    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
    const navigate = useNavigate()


    const formLogin = useForm<z.infer<typeof AuthenticationSchema>>({
        resolver: zodResolver(AuthenticationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const formSingUp = useForm<z.infer<typeof createEmailAccountSchema>>({
        resolver: zodResolver(createEmailAccountSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            phone: "+244"
        },
    })

    const [showAuthForm, setShowAuthForm] = useState<FormAuth>(FormAuth.EMAIL_LOGIN);

    function onChangeAuthState() {
        if (showAuthForm === FormAuth.EMAIL_LOGIN) {
            setShowAuthForm(FormAuth.EMAIL_REGISTER)
        } else {
            setShowAuthForm(FormAuth.EMAIL_LOGIN)
        }
    }

    function handleGoogleSignIn() {
        signInWithGoogle()
            .then((data) => {
                navigate(`/`)
            })
            .catch(err => {
                toastMessage({
                    title: err,
                    statusToast: ToastStatus.ERROR,
                    pauseOnHover: false,
                    draggable: false,
                    position: "top-right"
                })
            })
    }

    function onSubmit(data: z.infer<typeof AuthenticationSchema>) {
        setUserEmail(data.email)
        setUserPassword(data.password)

        signInWithEmailAndPassword()
            .then(async (user) => {
                navigate(`/`)
            })
            .catch(err => {
                toastMessage({
                    title: err,
                    statusToast: ToastStatus.ERROR,
                    position: "top-right"
                })
            })
    }

    return (
        <>
            {showAuthForm === FormAuth.EMAIL_LOGIN && (
                <LoginForm
                    form={formLogin}
                    handleGoogleSignIn={handleGoogleSignIn}
                    onSubmit={onSubmit}
                    onChangeAuthState={onChangeAuthState}
                />
            )}

            {showAuthForm === FormAuth.EMAIL_REGISTER && (
                <SignUpForm
                    form={formSingUp}
                    handleGoogleSignIn={handleGoogleSignIn}
                    onSubmit={onSubmit}
                    onChangeAuthState={onChangeAuthState}
                />
            )}
        </>

    )
}
