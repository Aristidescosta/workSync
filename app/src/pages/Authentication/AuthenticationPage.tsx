import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthenticationSchema } from '@/src/schemas'
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserSessionStore } from '@/src/hooks'
import { useToastMessage } from '@/react-toastify'

export const AuthenticationPage = () => {
    const { toastMessage, ToastStatus, } = useToastMessage();
    const signInWithGoogle = useUserSessionStore(state => state.signInWithGoogle)
    const signInWithEmailAndPassword = useUserSessionStore(state => state.signInWithEmailAndPassword)
    const setUserEmail = useUserSessionStore(state => state.setUserEmail)
    const setUserPassword = useUserSessionStore(state => state.setUserPassword)
    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof AuthenticationSchema>>({
        resolver: zodResolver(AuthenticationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

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
        <Form {...form}>
            <form className='w-full p-6 min-h-screen items-center justify-center flex' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='bg-primary w-[min(36.25rem,_calc(100vw_-_2rem))] p-6 flex flex-col gap-2 rounded-md'>
                    <h1 className='text-3xl mb-6 text-center lowercase first-letter:uppercase'>Work<span className='lowercase first-letter:uppercase'>Sync</span></h1>
                    <p className='text-sm text-center'>Inicie sessão na sua conta</p>

                    <div className='flex flex-col gap-4 mt-12'>
                        <Button
                            variant={"outline"}
                            type='button'
                            onClick={handleGoogleSignIn}
                            disabled={loadingUserSession}
                        >
                            <WorkSyncIcon
                                name='FcGoogle'
                                package='flatcolor'
                            />
                            Google
                        </Button>
                        <div className="flex items-center w-full">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">Ou</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>


                        <div className='flex flex-col gap-6 text-xs'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="Insira o seu e-mail" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} placeholder="Insira a sua senha" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <p className='text-right text-secondary'>Recuperar conta</p>
                            <Button
                                variant={"secondary"}
                                type='submit'
                                disabled={loadingUserSession}
                            >
                                {
                                    loadingUserSession && <Loader2 className="animate-spin" />
                                }
                                {loadingUserSession ? 'Processando...' : 'Entrar'}
                            </Button>
                            <p className='text-center'>Não tem uma conta? <Link to={"/auth/sign-up"} className='text-secondary'>Criar conta</Link></p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
