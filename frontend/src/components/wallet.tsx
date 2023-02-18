import { walletPresentAtom, addressPreviewAtom, initiateWalletAtom, walletAtom } from '../store/walletStore';
import LoginIcon from '@mui/icons-material/Login';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Button, Stack } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react'
import { teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
    const walletPresent = useAtomValue(walletPresentAtom);
    const previewAddress = useAtomValue(addressPreviewAtom);
    const initiateWallet = useSetAtom(initiateWalletAtom);
    const [wallet] = useAtom(walletAtom);
    const navigate = useNavigate();
    if (walletPresent)
        return (
            <Button onClick={() => navigate(`/profile/${wallet.address}`)} variant="outlined" startIcon={<AccountBalanceWalletIcon />} color="secondary">
                {previewAddress}
            </Button>
        )
    return (
        <Button onClick={initiateWallet} startIcon={<LoginIcon />} color="primary" variant="outlined">Connect wallet</Button>
    )
}

export default Wallet
