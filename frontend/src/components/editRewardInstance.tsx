import React, { useState } from 'react'
import { RewardAttribute } from '../utils/types'
import { AccountTransactionType, CcdAmount } from '@concordium/web-sdk';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { walletAtom } from '../store/walletStore';
import { createRewardAttributes } from '../utils/backend';
import { CONTRACT_INDEX, CONTRACT_NAME, RAW_SCHEMA } from '../utils/constants';
import { LoadingButton } from '@mui/lab';
import { Modal, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Chip, Stack, TextField, Alert, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { countries } from '../utils/countries';
import { validShareReward } from '../utils/utils';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
const style = {
    textAlign: "center",
    bgcolor: 'background.paper',
    border: '2px solid #343434',
    boxShadow: 24,
    p: 4,
    overflowY: "scroll"
};
const EditRewardInstance = ({ originalReward }: { originalReward: RewardAttribute }) => {
    const [loading, setLoading] = useState<boolean>();
    const [wallet] = useAtom(walletAtom)
    const [failed, setFailed] = useState<boolean>();
    const [shareReward, setShareReward] = useState<RewardAttribute>({
        ...originalReward,
        minAge: dayjs().year() - Number(originalReward.minAge!.toString().substring(0, 4)),
        maxAge: dayjs().year() - Number(originalReward.maxAge!.toString().substring(0, 4)),
    });
    const [updateSuccess, setUpdateSuccess] = useState<boolean>();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const formatDate = (dateN: number) => {
        if (dateN < 10)
            return `0${dateN}`
        return dateN;
    }
    const updateReward = async () => {
        setFailed(false)
        setLoading(true)
        if (wallet.address && wallet.provider !== undefined)

            try {
                const amountToAsk = Number(shareReward.amountPaidPerClick) *
                    Number(shareReward.maxPaidClicksPerUser) *
                    Number(shareReward.numberOfUsersAbleToClaim);
                const prevAmountToAsk = Number(originalReward.amountPaidPerClick) *
                    Number(originalReward.maxPaidClicksPerUser) *
                    Number(originalReward.numberOfUsersAbleToClaim);

                if (amountToAsk === prevAmountToAsk) {
                    if (amountToAsk > prevAmountToAsk) {
                        await wallet.provider.sendTransaction(
                            wallet.address,
                            AccountTransactionType.Update,
                            {
                                amount: new CcdAmount(BigInt(1000000 * (amountToAsk - prevAmountToAsk))),
                                address: {
                                    index: CONTRACT_INDEX,
                                    subindex: BigInt(0)
                                },
                                receiveName: `${CONTRACT_NAME}.load`,
                                maxContractExecutionEnergy: 3000n
                            },
                            {},
                            RAW_SCHEMA
                        );
                    }
                    else {
                        await wallet.provider
                            .sendTransaction(
                                wallet.address,
                                AccountTransactionType.Update,
                                {
                                    amount: new CcdAmount(0n),
                                    address: {
                                        index: CONTRACT_INDEX,
                                        subindex: BigInt(0)
                                    },
                                    receiveName: `${CONTRACT_NAME}.claimreward`,
                                    maxContractExecutionEnergy: 3000n
                                },
                                {
                                    amount_to_claim: BigInt(1000000 * (prevAmountToAsk - amountToAsk)).toString()
                                },
                                RAW_SCHEMA
                            )
                    }
                }
                await createRewardAttributes({
                    ...shareReward,
                    walletAddress: wallet.address,
                    minAge: `${dayjs().year() - Number(shareReward.minAge)}${formatDate(dayjs().month())}${formatDate(dayjs().day())}`,
                    maxAge: `${dayjs().year() - Number(shareReward.maxAge)}${formatDate(dayjs().month())}${formatDate(dayjs().day())}`,
                    numberOfUsersAbleToClaim: Number(shareReward.numberOfUsersAbleToClaim),
                    maxPaidClicksPerUser: Number(shareReward.maxPaidClicksPerUser),
                    amountPaidPerClick: Number(shareReward.amountPaidPerClick)
                });
                setUpdateSuccess(true)
            }
            catch (e: any) {
                console.log(e)
                setFailed(true);
            }
        setLoading(false)
    }

    return (
        <React.Fragment key={originalReward.id}>
            <IconButton sx={{ marginBottom: "auto" }} onClick={handleOpen}>
                <EditIcon />
            </IconButton>
            <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="dialog-update-reward-title"
                aria-describedby="dialog-update-reward-description">
                <DialogContent sx={style}>
                    {handleClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                    <Typography mx="auto" mb={8} variant="h4" gutterBottom>Edit shareable reward</Typography>
                    <Box sx={{ maxWidth: "30rem" }} mx="auto">
                        <Typography variant="h5" my={2} textAlign="left">Countries avalaible to</Typography>
                        <FormControl fullWidth >
                            <InputLabel id="country-select">Country</InputLabel>
                            <Select
                                labelId="country-select"
                                id="country-select"
                                multiple
                                value={shareReward?.countries ?? []}
                                label="Countries"
                                onChange={(e: SelectChangeEvent<string[]>) => {
                                    const {
                                        target: { value },
                                    } = e;
                                    setShareReward({ ...shareReward, countries: typeof value === 'string' ? value.split(',') : value })
                                }
                                }
                            >
                                {countries.map(country => <MenuItem value={country.code}>{country.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {shareReward?.countries.map((country, i) => (<Chip
                            sx={{ margin: 1 }}
                            label={countries.find(e => e.code === country)?.name}
                            onDelete={() => {
                                const tCountries = shareReward.countries ?? [];
                                tCountries.splice(i, 1);
                                setShareReward({ ...shareReward, countries: tCountries });
                            }}
                        />))}

                        <Typography variant="h5" my={2} textAlign="left">Ages avalaible to</Typography>
                        <Stack
                            justifyContent="center"
                            my={3}
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1, sm: 2, md: 4 }}
                        >
                            <TextField label="Min. age" value={shareReward.minAge} onChange={e => {
                                const cleanNum = (e.target.value || '').replace(/[^0-9\.]+/g,
                                    ''
                                );
                                setShareReward({ ...shareReward, minAge: cleanNum })
                            }} fullWidth />
                            <TextField label="Max age" value={shareReward.maxAge} onChange={e => {
                                const cleanNum = (e.target.value || '').replace(/[^0-9\.]+/g,
                                    ''
                                );
                                setShareReward({ ...shareReward, maxAge: cleanNum })
                            }} fullWidth />
                        </Stack>
                        <Typography variant="h5" my={2} textAlign="left">Link to share to users</Typography>
                        <TextField label="Link to share" value={shareReward.rewardLink} onChange={(e) => {
                            setShareReward({ ...shareReward, rewardLink: e.target.value });
                        }
                        } placeholder="https://" fullWidth />
                        <Alert severity="info" variant="outlined" sx={{ my: "2em" }}>
                            The CCD Reward amount can't be changed
                        </Alert>
                        <LoadingButton loading={loading} disabled={!validShareReward(shareReward)} onClick={() => updateReward()} variant="contained" color="warning" sx={{ marginY: 4 }}>
                            Update shareable reward
                        </LoadingButton>
                        {failed && (
                            <Alert sx={{ mb: 4 }} severity="error">
                                Couldn't update reward
                            </Alert>
                        )}
                        {updateSuccess && (
                            <Alert sx={{ mb: 4 }} severity="success">
                                Shareable reward updated successfully
                            </Alert>)}
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default EditRewardInstance