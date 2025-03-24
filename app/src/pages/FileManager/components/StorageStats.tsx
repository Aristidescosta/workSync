import { Box, Divider, Flex, Heading, Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

interface StorageStats {
    totalSpace: number
    totalSpaceUsed: number
}

export const StorageStats: React.FC<StorageStats> = (props) => {

    const {
        totalSpace,
        totalSpaceUsed
    } = props

    const [progressValue, setProgressValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const computeSpaceUsedPercentage = (spaceUsed: number): number => {
            return (spaceUsed / totalSpace) * 100;
        }

        setProgressValue(computeSpaceUsedPercentage(totalSpaceUsed));

        setIsAnimating(true);

        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [totalSpace, totalSpaceUsed])

    return (
        <Flex
            justifyContent={'center'}
            py={2}
            pl={10}
        >
            <Box
                borderBottomWidth={1}
                borderColor={'#DDDDDD'}
                bg={'#FFFFFF'}
                w={'full'}
                p={8}
            >
                <Heading as={'h3'} fontSize={24}>{`${totalSpaceUsed.convertToSystemNumerical(true)} usados de ${totalSpace.convertToSystemNumerical(true)}`} </Heading>
                <Divider mt={8} mb={8} />
                <Progress
                    value={progressValue}
                    colorScheme='red'
                    borderRadius={10}
                    hasStripe={isAnimating}
                    sx={{
                        '& > div': {
                            transition: 'width 1s ease-in-out',
                        }
                    }}
                />
            </Box>
        </Flex>
    )
}
