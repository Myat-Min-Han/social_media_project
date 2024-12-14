import React ,{ useRef }from "react";

import {
    Box,
    TextField,
    Button
} from "@mui/material"

type FormProps = {
    add: (content: string) => void
};

const Form = ({add}: FormProps): React.JSX.Element => {

    const contentRef = useRef<HTMLInputElement | null>(null);

    return (
        <form 
            onSubmit={e => {
                e.preventDefault();
                if(contentRef.current) {
                    const content = contentRef.current.value;
                    add(content);
                    contentRef.current.value = ''
                };
            }}
        >
            <Box sx={{ mb: 4, textAlign: 'right'}}>
            <TextField 
                type="text"
                placeholder="Content"
                fullWidth
                multiline
                sx={{ mb: 1}}
                inputRef={contentRef}
            />
            <Button
                variant="contained"
                type="submit"
            >
                Post
            </Button>
            </Box>
        </form>
    )
};

export default Form;