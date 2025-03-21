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
import { createEmailAccountSchema } from '@/src/schemas'
import { zodResolver } from "@hookform/resolvers/zod"

export const CreateEmailAccountForm = () => {
  const form = useForm<z.infer<typeof createEmailAccountSchema>>({
    resolver: zodResolver(createEmailAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "+244"
    },
  })

  function onSubmit(data: z.infer<typeof createEmailAccountSchema>) {
    console.log("USER DATA: ", data)
  }

  // Função para garantir que o número de telefone sempre comece com "+244" e somente números depois
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Garante que o número sempre comece com "+244"
    if (input.startsWith('+244')) {
      // Permite apenas números após o "+244" e limita a 9 números
      input = '+244' + input.slice(4).replace(/\D/g, '').slice(0, 9);
    } else {
      // Se não começar com "+244", substitui a entrada por "+244" e permite números
      input = '+244' + input.replace(/\D/g, '').slice(0, 9);
    }

    e.target.value = input;
  };

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
                        onChange={(e) => {
                          field.onChange(e);  // Atualiza o campo com o valor do React Hook Form
                          handlePhoneChange(e); // Aplica a máscara
                        }}
                        value={field.value} // Mantém o valor controlado
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
              <Button variant={"secondary"} type='submit'>Entrar</Button>
              <p className='text-center'>Já tem uma conta? <Link to={"/auth/sign-in"} className='text-secondary'>Entrar</Link></p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
