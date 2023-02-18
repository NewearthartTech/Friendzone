import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getAllRewardsAttributedByAddress, getReferalInfoByWalletAddress } from '../utils/backend';
import { Referal, RewardAttribute } from '../utils/types';
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Backdrop, Box, Card, CardActions, CardContent, CircularProgress, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { walletAtom } from '../store/walletStore';
import { ExpandMore } from '@mui/icons-material';
import CopyLink from '../utils/ui/copyLink';

const Profile = () => {
    const { address } = useParams();
    const [wallet] = useAtom(walletAtom);
    const [creatorRewards, setCreatorRewards] = useState<RewardAttribute[]>([]);
    const [referrals, setReferrals] = useState<Referal[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();
    const navigate = useNavigate();
    const [failed, setFailed] = useState<boolean>()
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const fRewards = await getAllRewardsAttributedByAddress(address ?? "");
                setCreatorRewards(fRewards);
                if (wallet.address === address) {
                    const fReferals = await getReferalInfoByWalletAddress(address ?? "");
                    setReferrals(fReferals);
                }
            }
            catch {
                setFailed(true)
            }
            setIsLoading(false);
        })()
    }, [])
    if (isLoading)
        return (
            <Backdrop
                sx={{ zIndex: 2 }}
                open={isLoading}
            >
                <CircularProgress color="primary" />
            </Backdrop>
        )
    if (failed)
        return (
            <Alert sx={{ margin: 4 }} severity="error">
                <AlertTitle>Couldn't fetch user</AlertTitle>
            </Alert>
        )
    return (
        <Box sx={{ maxWidth: "60rem", mx: "auto", my: "4em" }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Address
            </Typography>
            <Typography variant="h6" sx={{ lineBreak: "anywhere", mb: "2em" }}>
                {address}
            </Typography>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="rewards-content"
                    id="rewards-header"
                >
                    <Typography>Shareable Rewards</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ m: "3" }}>
                    {creatorRewards.map((reward, i) => (
                        <Card key={i} sx={{ marginY: "2em" }} variant="outlined">
                            <CardContent>
                                <Box>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Total Cost
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} variant="h6" color="text.secondary">
                                        {(Number(reward.amountPaidPerClick) ?? 0) *
                                            (Number(reward.numberOfUsersAbleToClaim) ?? 0) *
                                            (Number(reward.maxPaidClicksPerUser) ?? 0)} CCD
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Link to share
                                    </Typography>
                                    <CopyLink link={`${import.meta.env.DEV ? "http://" : "https://"}${window.location.host}/claim/${reward.id}`} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </AccordionDetails>
            </Accordion>
            {wallet.address === address && (<Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="referrals-content"
                    id="referrals-header"
                >
                    <Typography>Referrals</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    {referrals.map((referral, i) => (
                        <Card key={i} sx={{ marginY: "2em", cursor: "pointer" }} variant="outlined" onClick={() => navigate(`/claim/${referral.rewardId}`)}>
                            <CardContent>
                                <Box>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Avalaible to redeem
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} variant="h6" color="text.secondary">
                                        {referral.amountToClaim} CCD
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Link to share
                                    </Typography>
                                    <CopyLink link={referral.personalLink ?? ""} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </AccordionDetails>
            </Accordion>)}
        </Box>
    )
}

export default Profile