import { WorkSyncModal } from '@/src/components/modals'
import { StepsAuth } from '@/src/enums/StepsAuth'
import { useUserSessionStore } from '@/src/hooks'
import React, { useState } from 'react'
import { AuthenticationPage } from './AuthenticationPage'

export const Authentication = () => {
  const [isModalOpen, setIsOpenModal] = useState(false)


  const onCloseModal = () => {
    setIsOpenModal(false)
  }
  const onOpenModal = () => {
    setIsOpenModal(true)
  }

  const stepsAuth = useUserSessionStore(state => state.stepsAuth)

  return (
    <>
      {
        stepsAuth === StepsAuth.AUTHENTICATION ?
          <AuthenticationPage />
          :
          <AuthenticationPage />
      }
    </>
  )
}
