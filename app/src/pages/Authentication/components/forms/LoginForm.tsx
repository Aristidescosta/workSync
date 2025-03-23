import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { useUserSessionStore } from '@/src/hooks'
import { AuthenticationSchema } from '@/src/schemas'
import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface ILoginFormProps {
    handleGoogleSignIn: () => void
    form: UseFormReturn<{
        email: string;
        password: string;
    }, any, undefined>
    onSubmit: (data: z.infer<typeof AuthenticationSchema>) => void
    onChangeAuthState: () => void
}

export const LoginForm = ({ form, handleGoogleSignIn, onSubmit, onChangeAuthState }: ILoginFormProps) => {

    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)

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
                            <p onClick={onChangeAuthState} className='text-center'>Não tem uma conta? <span className='text-secondary'>Criar conta</span></p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
