import { ZenTaakIcon } from '@/react-icons'
import IntegrationWithGithub from './tabs/IntegrationWithGithub'
import { Box, Flex, Text, Tab, TabList, TabPanel, TabPanels, Tabs, Card } from '@chakra-ui/react'

export default function SettingsScreen(): JSX.Element {


    return (
        <Tabs>
            <TabList
                border={'none'}
                display={'flex'}
                flexDir={'column'}
                float={'left'}
                w={'180px'}
                h={'480px'}
                bg={'white'}
                borderRight={'1px solid rgb(0,0,0,0.2)'}
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
            >
                <Box w={'100%'} p={'10px'} color={'gray.400'}>
                    <Text w={'100%'} fontSize={'13'}>Conta</Text>
                </Box>
                <Tab
                    w={'100%'}
                    borderRadius={'3px'}
                    fontSize="15px"
                    color={'gray.500'}
                    _selected={{
                        color: "red.200",
                        borderLeft: '2px solid #dd0000',
                        fontWeight: "bold",
                    }}
                >
                    <Flex w={'100%'} h={'20px'} justify={'left'} align='center'>
                        <ZenTaakIcon
                            package={'feather'}
                            name={'FiUser'}
                            size={16}
                            color={"gray.500"}
                        />
                        <Text ml={'10px'} mt={'auto'}>Dados Pessoais</Text>
                    </Flex>
                </Tab>
                <Box w={'100%'} p={'10px'} color={'gray.400'}>
                    <Text w={'100%'} fontSize={'13'}>Subscrição</Text>
                </Box>
                <Tab
                    w={'100%'}
                    borderRadius={'3px'}
                    fontSize="15px"
                    color={'gray.500'}
                    _selected={{
                        color: "red.200",
                        borderLeft: '2px solid #dd0000',
                        fontWeight: "bold",
                    }}
                >
                    <Flex w={'100%'} h={'20px'} justify={'left'} align='center'>
                        <ZenTaakIcon
                            package={'feather'}
                            name={'FiLayers'}
                            size={16}
                            color={"gray.500"}
                        />
                        <Text ml={'10px'} mt={'auto'}>Planos</Text>
                    </Flex>
                </Tab>
                <Box w={'100%'} p={'10px'} color={'gray.400'}>
                    <Text w={'100%'} fontSize={'13'}>Integração</Text>
                </Box>
                <Tab
                    w={'100%'}
                    borderRadius={'3px'}
                    fontSize="15px"
                    color={'gray.500'}
                    _selected={{
                        color: "red.200",
                        borderLeft: '2px solid #dd0000',
                        fontWeight: "bold",
                    }}
                >
                    <Flex w={'100%'} h={'20px'} justify={'left'} align='center'>
                        <ZenTaakIcon
                            package={'feather'}
                            name={'FiGithub'}
                            size={16}
                            color={"gray.500"}
                        />
                        <Text ml={'10px'} mt={'auto'}>GitHub</Text>
                    </Flex>
                </Tab>
            </TabList>
            <TabPanels ml={'180px'} bg={'white'} borderTopRightRadius="5px" borderBottomRightRadius="5px">
                <TabPanel w={'75%'} h={'480px'}>
                    1
                </TabPanel>
                <TabPanel w={'75%'} h={'480px'}>2</TabPanel>
                <TabPanel w={'75%'} h={'480px'}>
                    <IntegrationWithGithub />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}