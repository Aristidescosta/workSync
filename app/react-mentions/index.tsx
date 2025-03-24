//import TextInput from 'react-autocomplete-input';
//import 'react-autocomplete-input/dist/bundle.css';

import { useTeamStore } from '@/src/hooks/useTeam';
import { useEffect } from 'react';
import { useUserSessionStore } from '@/src/hooks/useUserSession';
import { Box, Textarea } from '@chakra-ui/react';
import { UserSessionType } from '@/src/types/UserSessionType';

interface ReactMentionsInput {
    value: string
    usersAssigned: UserSessionType[]
    onInputChange: (value: string) => void;
}

export default function ReactMentionsInput(props: ReactMentionsInput): JSX.Element {

    const getAllMembers = useTeamStore(state => state.getAllMembers)
    //const usersTeamMembersSuggestions = useTeamStore(state => state.usersTeamMembersSuggestions)

    const session = useUserSessionStore(state => state.userSession)
    const placeholder = props.usersAssigned.filter(u => u.id === session?.id).length !== 1 ?
        `Escreva um comentário ou responda para @${props.usersAssigned.map(user => user.displayName).join(' ou @')}` :
        "Escreva um comentário..."

    useEffect(() => {
        const unsubscribe = getAllMembers()
        return unsubscribe()
    }, [])

    function onChangeValue(e: React.ChangeEvent<HTMLTextAreaElement>) {
        props.onInputChange(e.target.value)
    }

    return (
        <Box>
            <Textarea
                mt={2}
                size="md"
                minHeight={"80px"}
                maxH={"150px"}
                border="1px solid #ddd"
                value={props.value}
                _placeholder={{ fontSize: 13, color: "#555", opacity: 0.8 }}
                placeholder="Escreva um comentário"
                onChange={onChangeValue}
            />
        </Box>
    );
}