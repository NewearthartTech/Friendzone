import { ContentCopy } from '@mui/icons-material'
import { Box, Link, IconButton } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { copyText } from '../utils'

const CopyLink = ({ link }: { link: string }) => {
    return (
        <Box sx={{
            position: "relative",
            border: '2px solid #343434',
            borderRadius: "10px",
            textAlign: "center",
            mx: "0.5em",
            my: 1,
            padding: "0.5em",
            wordBreak: "break-all"
        }}>
            <Link onClick={(e) => {
                e.stopPropagation()
            }}
                href={link} target="_blank" sx={{ lineBreak: "anywhere", marginRight: "1em" }}>{link}</Link>
            <IconButton onClick={(e) => {
                e.stopPropagation()
                copyText(link ?? "")
                toast.success("Link copied successfully")
            }} aria-label="copy" sx={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", right: -10, bgcolor: "#121212" }}>
                <ContentCopy />
            </IconButton>
        </Box>
    )
}

export default CopyLink