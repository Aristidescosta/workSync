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
      
    </Form>
  )
}
