import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Wallet from './wallet';
import { Add, Logout } from '@mui/icons-material';
import { Button, Link, useMediaQuery } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { walletAtom, walletPresentAtom } from '../store/walletStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const walletPresent = useAtomValue(walletPresentAtom);
    const [wallet, setWallet] = useAtom(walletAtom);
    const matches = useMediaQuery('(min-width:600px)');
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Link href="/" variant="inherit" underline="none" sx={{ flexGrow: 1, fontStyle: "italic" }}>
                        <img src="/logo.png" alt="FrndZone" style={{ height: "2rem" }} />
                    </Link>


                    {walletPresent && (<Button onClick={() => navigate("/upload")} sx={{ marginX: { xs: "0.5em", sm: "1em" } }} variant="outlined">
                        <Add /> {matches && <span>Create shareable link</span>}
                    </Button>)}
                    <Wallet />
                    {walletPresent && (
                        <Button onClick={() => setWallet({})} sx={{ marginX: { xs: "0.5em", sm: "1em" } }} variant="outlined" color="error">
                            <Logout />
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
