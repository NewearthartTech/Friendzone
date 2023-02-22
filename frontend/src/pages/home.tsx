import { Box, Card, CardContent, Stack, Typography, useMediaQuery, Link } from '@mui/material'
import { useSetAtom } from 'jotai';
import React from 'react'
import { initiateWalletAtom } from '../store/walletStore';
import { ArrowDownward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../utils/ui/featureCard';
import YoutubeEmbed from '../utils/ui/youtubeEmbed';
const Home = () => {
    const matches = useMediaQuery('(max-width:900px)');
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
                <FeatureCard onClick={() => document.getElementById("sign-up")!.scrollIntoView()} title="SIGN-UP" description="Sign-up using Concordium wallet" />
                <FeatureCard onClick={() => document.getElementById("create")!.scrollIntoView()} title="CREATE" description="Create shareable link" />
                <FeatureCard onClick={() => document.getElementById("share")!.scrollIntoView()} title="SHARE" description="Share the link with friends" />
                <FeatureCard onClick={() => document.getElementById("reward")!.scrollIntoView()} title="REWARD" description="Claim reward once the link is accessed" />
            </Stack>

            <Box sx={{ maxWidth: "50rem", mx: { xs: 2, md: "auto" } }}>
                <Typography fontSize={14} mt={4}>
                    <b>Introducing FriendZone</b> - the app that rewards you for sharing great content with your friends.<br />
                    When you login and create a personal shareable link, it becomes easy to share great links with your friends.<br />
                    They'll love the perks - whenever a friend opens or accesses the link, you get rewarded.<br />
                    So go ahead, pull up a chair and get ready to share some amazing stuff with your friends!<br />
                </Typography>

                <Box>
                    <Typography variant="h3" mt={32}>Docs</Typography>


                    <Box id="sign-up" mt={8}>
                        <Typography variant="h5" my={4} color="secondary">Sign up</Typography>
                        <YoutubeEmbed embedId="MDxvR-Y7SZE" />
                        <Typography my={4}>
                            To open a FriendZone application enter <Link href="https://friendzone.staging.newearthart.tech/">https://friendzone.staging.newearthart.tech/</Link> on your browser.
                            Click on Connect wallet available in the upper-right corner of the screen.
                            When the wallet opens up, read the disclaimer and click on connect.
                            The user has successfully sign up to FriendZone via Concordium wallet.
                            Now you can create sharable rewards links and share them with your friends.
                        </Typography>
                    </Box>
                    <Box id="create" mt={8}>
                        <Typography variant="h5" my={4} color="primary">Create</Typography>
                        <YoutubeEmbed embedId="fISJoKqZag8" />
                        <Typography>
                            The creator logins to the FrndZ application using Concordium.
                            They will enter the following details for the influencer to share the links:
                        </Typography>
                        <ul>
                            <li>
                                Select the country to which links can be shared and accessed.
                            </li>
                            <li>
                                Enter the age range to whom the links can be made available to access.
                            </li>
                            <li>
                                No. of influencers that can copy the link and share with users/guests.
                            </li>
                            <li>
                                CCD to be paid on each click of the guest users.
                            </li>
                            <li>
                                Maximum number of clicks to claim the reward as total CCD.
                            </li>
                            <li>
                                Creator will click on “Generate Reward”.
                            </li>
                        </ul>
                        <Typography>
                            A sharable reward link is generated. Copy the link and share it with friends and on social media.
                        </Typography>
                    </Box>
                    <Box id="share" mt={8}>
                        <Typography variant="h5" my={4} color="yellow">Share</Typography>
                        <YoutubeEmbed embedId="wGxixOY1NIU" />
                        <ul>
                            <li>
                                Open the link (<Link href="https://friendzone.staging.newearthart.tech/claim/63f5c594395920be3b1f4b93">Example</Link>) shared by your friend/creator.
                            </li>
                            <li>
                                Connect to the Concordium wallet to verify your account.
                            </li>
                            <li>
                                If the account is verified(i.e influencers account comes under targeted country and age group), click on 'Accept'.
                            </li>
                            <li>
                                Click on the copy button for the personal shareable link to copy it.
                            </li>
                            <li>
                                Share it with friends via messaging or social media and claim the reward once they access the link.
                            </li>
                        </ul>
                    </Box>
                    <Box id="reward">
                        <Typography variant="h5" my={4} color="secondary">Claim</Typography>
                        <ul>
                            <li>
                                Open the link (<Link href="https://friendzone.staging.newearthart.tech/ref/63f601f0395920be3b1f4ba0">Example</Link>) shared by the friend/influencer.
                            </li>
                            <li>
                                Connect to the Concordium wallet to verify your account.
                            </li>
                            <li>
                                If the account is verified (i.e influencers account comes under targeted country and age group), click on 'Accept'.
                            </li>
                            <li>
                                Users will be redirected to the content page/ youtube videos/ website etc of the creator.
                            </li>
                            <li>
                                Once the link is accessed, the influencer will see that CCD amount will be credited to his referral page.
                            </li>
                            <li>
                                Click on the 'claim' button to add it to the wallet.
                            </li>
                        </ul>
                        <Typography>
                            CCD is a referral reward program that allows users to earn rewards for referring their friends and family. When a user clicks on the ‘claim’ button on their referral page, they will be redirected to the content or youtube videos of the creator, as long as their account is verified i.e falls within the targeted country and age group. Once the link is accessed, the influencer will see that CCD amount will be credited to his referral page.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default Home
