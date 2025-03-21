import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { Link } from 'react-router-dom'

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

export const AuthenticationPage = () => {
    const form = useForm<z.infer<typeof AuthenticationSchema>>({
        resolver: zodResolver(AuthenticationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof AuthenticationSchema>) {
        console.log("USER DATA: ", data)
    }

    return (
        <Form {...form}>
            <form className='w-full p-6 min-h-screen items-center justify-center flex' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='bg-primary w-[min(36.25rem,_calc(100vw_-_2rem))] p-6 flex flex-col gap-2 rounded-md'>
                    <h1 className='text-3xl mb-6 lowercase first-letter:uppercase'>Work<span className='lowercase first-letter:uppercase'>Sync</span></h1>
                    <p className='text-sm'>Inicie sessão na sua conta</p>

                    <div className='flex flex-col gap-4 mt-12'>
                        <Button variant={"outline"} type='button'>
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
                            <Button variant={"secondary"} type='submit'>Entrar</Button>
                            <p className='text-center'>Não tem uma conta? <Link to={"/auth/sign-up"} className='text-secondary'>Criar conta</Link></p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
