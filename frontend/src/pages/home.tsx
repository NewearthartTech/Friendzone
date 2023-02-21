import { Box, Card, CardContent, Stack, Typography, useMediaQuery } from '@mui/material'
import { useSetAtom } from 'jotai';
import React from 'react'
import { initiateWalletAtom } from '../store/walletStore';
import { ArrowDownward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../utils/ui/featureCard';
const Home = () => {
    const matches = useMediaQuery('(max-width:600px)');
    const initiateWallet = useSetAtom(initiateWalletAtom);
    const navigate = useNavigate();


    return (
        <Box my={12}>
            <Stack
                justifyContent="center"
                maxWidth="5 0rem"
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
                <img src="/logo.png" style={{ maxWidth: "13rem", margin: `auto ${matches ? "auto" : "0"}` }} />
                <Box sx={{ marginBottom: { md: 10 }, textAlign: { xs: "center", md: "left" } }}>
                    <Typography variant="h3" sx={{ mt: 3 }}>
                        FrndZone
                    </Typography>
                    <Typography variant="h6">
                        The app that rewards you to share a link
                    </Typography>
                </Box>
            </Stack>
            <Typography fontSize={14} mt={4} textAlign="center">
                FrndZ is an app which gives you rewards for sharing links among friends.
                <br />Whenever you share a link with a friend, they open it and you get a reward in CCD
            </Typography>
            <Stack
                mt={12}
                justifyContent="center"
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
                <FeatureCard onClick={initiateWallet} title="SIGN-UP" description="Sign-up using concordium wallet" />
                <FeatureCard onClick={() => navigate("/upload")} title="CREATE" description="Create shareable link" />
                <FeatureCard title="SHARE" description="Share the link with friends" />
                <FeatureCard title="REWARD" description="Claim reward once the link is accessed" />
            </Stack>
        </Box >
    )
}

export default Home
