# Friendzone
The friend zone app

## THIS SECTION IS FOR RUNNING THE DEPLOYED APP
# Concordium mainet address

# How to run frndz dapp 
Click on the link https://friendzone.staging.newearthart.tech/ to access FriendZone dapp

# What the app does and how to use it
FrndZ is an app which gives you rewards for sharing links among friends.
Whenever you share a link with a friend, they open it and you get a reward in CCD.

# What the app does.

The app is divided into 3 types of users. 
Creators
Influencers
Users

`Creators` are users who have their youtube video / potcast / website / etc that they want to promote on Frndz dapp. 
Frndz give them the possibility of promoting their content and giving rewards (in CCD) to influencers who share their links.
When a creator is creating his reward, he/she has to provide the following information
1. The targeted countries
2. The targeted age group
3. The link he/she wants to promote
4. Maximum number of influencers that can create personal links / able to claim CCD (influencers will create personal link and share the link to their friends)
5. Amount of CCD paid for each click
6. Maximum number of claimable link clicks per influncer

The total amount that the creator will have to put in the contract will be automatically calculated from the above information and the rewarder goes ahead
and create the reward.
On successful creation, a sharable link is giving to the creator. He/she can share the link to his reward with friend and on social media.

`Influencers` are users who can create personal (referal) links by accessing the link creator shared to them. 
Once an influencer access the link a creator shared, he/she is asked to connect his/her wallet to verify his location and age as per the requirements of the
creator. After verifying, a personal link is created (If and only if the maximum number of influencers able to claim CCD has not reached) and giving to the
influencer which he/she can share with friends and social media.
Also, on the same page, the influencer is able to see the total amount of CCD he/she can claim, and there is a Claim button that he/she can click to claim 
the reward from the contract.

`Users` are people who click on the links shared by influencers. Once they click on the link, it takes them to Frndz dapp and ask them to connect their wallet
in order to verify their location and age group using concordium identity. 
Once verified, the amount to claim is being updated for the influencer, and the user is being `redirected` to the link the creator wants to promote. 
Once the maximum number of claimable link clicks per influencer is reached, the users get redirected to the promoted link but the influencer doesn't get paid.

Finally, the influencer can click to claim his/her rewards.

# How to use it
Click on https://friendzone.staging.newearthart.tech/ to go to the home page of FriendZone. On the home page you will see four modules that takes you to 
short videos and descriptions on how to `Sign up`, how to `Create a sharable link as a rewarder`, how to `share the link with friends as an influencer`,
how to `Claim your reward once the link is accessed`. 

1. Connect your wallet at the top right corner
2. Click on `Create sharable link` at the top right corner beside your wallet address.
3. Fill the form provided
   {
        "countries": "['DK', 'US', 'IN', 'CM', 'CA']",
        "minAge": "20",
        "maxAge": "70",
        "rewardLink": "https://gitcoin.co/issue/29744",
        "numberOfUsersAbleToClaim": "10",
        "amountPaidPerClick": "1.2"
        "maxPaidClicksPerUser": "20"
   }
The image can be seen below

<img width="377" alt="demo screen" src="https://user-images.githubusercontent.com/125147811/220603458-bf7e47e1-2d8d-4922-bff0-e0fa238ca1c9.png">


<img width="386" alt="demo screen 2" src="https://user-images.githubusercontent.com/125147811/220603481-1854d020-50fa-47c1-ad47-7bade729166f.png">


4. Click on `Generate reward link`.
5. Copy the generated link and shared with one or two friends who will play the role of an influencer
6. The friends will access the link and connect their wallets for verification.
7. A personal link will be generated for them. 
8. The influencers should copy their personal links and share with friends and on social media
9. Once the friends of the influencers access the influencer's personal link, they will be redirected to the promoted link (site).
10. The influencer can now click on the referesh button beside the amount of reward to claim. 
11. He/She will see the updated amount to claim
12. Click on the Claim button to claim your reward.













## THIS SECTION IS FOR RUNNING THE APP LOCALLY
# Backend
# To start docker
move into `src`

ensure your docker desktop is running.
run `docker compose build` 
run `docker compose up -d`

# Frontend
### Starting up
Add packages by running `yarn`, then run the Front end server with `yarn dev`

# Contract
rawModuleSchema = `//8DAQAAAAUAAABmcm5kegACAAAACwAAAGNsYWltcmV3YXJkBBQAAQAAAA8AAABhbW91bnRfdG9fY2xhaW0KFQIAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIZAAAAQ29udHJhY3RBZGRyZXNzTm90QWxsb3dlZAIEAAAAbG9hZAMVAgAAABAAAABQYXJzZVBhcmFtc0Vycm9yAhkAAABDb250cmFjdEFkZHJlc3NOb3RBbGxvd2VkAgA`

moduleReference = `7605519e99b2466812056c6e3b1f54b171030fe55070184614611608bf0f80c5`

contract index = `3133`
