import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { useUserSessionStore } from '@/src/hooks'
import { createEmailAccountSchema } from '@/src/schemas'
import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface ISingUpFormProps {
    handleGoogleSignIn: () => void
    form: UseFormReturn<{
        fullName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
    }, any, undefined>
    onSubmit: (data: z.infer<typeof createEmailAccountSchema>) => void
    onChangeAuthState: () => void
}

export const SignUpForm = ({
    form,
    handleGoogleSignIn,
    onChangeAuthState,
    onSubmit
}: ISingUpFormProps) => {

    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)

    return (
        <Form {...form}>
            <form className='w-full p-6 min-h-screen items-center justify-center flex' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='bg-primary w-[min(36.25rem,_calc(100vw_-_2rem))] p-6 flex flex-col gap-2 rounded-md'>
                    <h1 className='text-3xl mb-6 lowercase first-letter:uppercase'>Work<span className='lowercase first-letter:uppercase'>Sync</span></h1>
                    <p className='text-sm'>Inicie sessão na sua conta</p>

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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome completo</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="Insira o seu nome completo" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="Insira o seu número"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar senha</FormLabel>
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
                                {loadingUserSession ? 'Criando a conta...' : 'Criar conta'}
                            </Button>
                            <p onClick={onChangeAuthState} className='text-center'>Já tem uma conta? <span className='text-secondary'>Entrar</span></p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
