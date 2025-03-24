import { ZenTaakIcon } from '@/react-icons'
import { ZentaakButton } from '@/src/components/Button'
import { useSubscriptionStore } from '@/src/hooks/useSubscription'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'

interface IStorageHeaderPageProps {
    onModalUploadFilesOpen: () => void
    onPackagePageOpen: () => void
}

export const StorageHeaderPage: React.FC<IStorageHeaderPageProps> = (props) => {

    const storageSubscription = useSubscriptionStore(state => state.storageSubscription)

    const {
        onModalUploadFilesOpen,
        onPackagePageOpen
    } = props

    return (
        <Flex
            bg="white"
            justifyContent="space-between"
            alignItems="center"
            px={10}
            h={'7vh'}

        >
            <Heading as='h1' fontSize={'22px'}>
                Gestão de armazenamento
            </Heading>

            <Box display={'flex'} gap={4}>
                <ZentaakButton
                    variant="info"
                    borderRadius="5px"
                    py="1.5rem"
                    bg={'black'}
                    loadingText="A comprar espaço..."
                    isLoading={false}
                    onClick={onModalUploadFilesOpen}
                >
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name="GoUpload"
                        color="#fff"
                        size={16}

                    />
                    <Text ml="3">Upload de ficheiros</Text>
                </ZentaakButton>
                {
                    storageSubscription ? null :
                        <ZentaakButton
                            variant="info"
                            borderRadius="5px"
                            py="1.5rem"
                            bg={'red.100'}
                            loadingText="A comprar espaço..."
                            isLoading={false}
                            onClick={onPackagePageOpen}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoPlus"
                                color="#fff"
                                size={16}
                            />
                            <Text ml="3">Comprar espaço</Text>
                        </ZentaakButton>
                }
            </Box>
        </Flex>
    )
}
