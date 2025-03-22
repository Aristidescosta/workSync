import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkSyncIcon } from '@/react-icons'
import { Link, useNavigate } from 'react-router-dom'

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
import { useToastMessage } from '@/react-toastify'
import { useUserSessionStore } from '@/src/hooks'
import { Loader2 } from 'lucide-react'

export const CreateEmailAccountForm = () => {
  const { toastMessage, ToastStatus, } = useToastMessage();
  const signInWithGoogle = useUserSessionStore(state => state.signInWithGoogle)
  const createUserWithEmailAndPassword = useUserSessionStore(state => state.createUserWithEmailAndPassword)
  const setUserEmail = useUserSessionStore(state => state.setUserEmail)
  const setUserPassword = useUserSessionStore(state => state.setUserPassword)
  const setUserFullName = useUserSessionStore(state => state.setUserFullName)
  const navigate = useNavigate()
  const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)

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
    setUserEmail(data.email)
    setUserFullName(data.fullName)
    setUserPassword(data.password)

    createUserWithEmailAndPassword()
      .then((response) => {
        console.log("RESPONSE: ", response)
      })
      .catch((err) => {
        toastMessage({
          title: err,
          statusToast: ToastStatus.ERROR,
          position: "top-right"
        })
      })
  }


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    if (input.startsWith('+244')) {

      input = '+244' + input.slice(4).replace(/\D/g, '').slice(0, 9);
    } else {
      input = '+244' + input.replace(/\D/g, '').slice(0, 9);
    }

    e.target.value = input;
  };

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
              <p className='text-center'>Já tem uma conta? <Link to={"/auth/sign-in"} className='text-secondary'>Entrar</Link></p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
