/* eslint-disable import/no-anonymous-default-export */
export default {
    
    control: {
        marginTop: 2,
        minHeight: '80px',
        maxHeight: '150px',
        border: '1px solid #ddd',
        fontSize: 13,
        color: '#111',
        opacity: 0.8,
        borderRadius: "6px"
    },
    input: {
        padding: "10px",
    },
    '&multiLine': {
        control: {
            minHeight: 86,
            overflow: 'auto'
        },
        highlighter: {
            padding: 8,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
            borderRadius: "6px"
        },
    },

    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 16,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#cee4e5',
            },
        },
    },
}