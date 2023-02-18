﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using src.models;

namespace src.Controllers
{
    public class ReferalResponse
    {
        public Referal Referal { get; set; }
        public RewardAttribute RewardAttribute { get; set; }
    }

    public class RewardClaim
    {
        public string PersonalLink { get; set; }
        public string WalletAddress { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class RewardsController : ControllerBase
    {
        readonly ILogger _logger;
        readonly IDbService _db;
        readonly IConfiguration _config;

        public RewardsController(ILogger<RewardsController> logger, IDbService db, IConfiguration config)
        {
            _logger = logger;
            _db = db;
            _config = config;
        }


        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            var result = "Success";
            return Ok(result);
        }

        [HttpGet("{rewardid}")]
        public async Task<RewardAttribute> GetRewardAttributes(string rewardid)
        {
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();
            return await rewardAttributeCollection.Find(r => r.Id == rewardid).FirstAsync();
        }

        [HttpGet("u/{walletaddress}")]
        public async Task<RewardAttribute[]> GetAllRewardAttributedByWalletAddress(string walletaddress)
        {
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();
            var rewards = await rewardAttributeCollection.Find(r => r.WalletAddress == walletaddress).ToListAsync();
            return rewards.ToArray();
        }

        [HttpPost("createReward")]
        public async Task<RewardAttribute> CreateRewardAttributes([FromBody]RewardAttribute rewardAttribute)
        {
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();
            if (!String.IsNullOrWhiteSpace(rewardAttribute.Id)) {
                var existingReward = await rewardAttributeCollection.Find(r => r.Id != rewardAttribute.Id).FirstOrDefaultAsync();

                if (existingReward != null)
                {
                    var replacedReward = await rewardAttributeCollection.ReplaceOneAsync(re => re.Id == rewardAttribute.Id, rewardAttribute);
                    return await GetRewardAttributes(rewardAttribute.Id);
                }
            }

            await rewardAttributeCollection.InsertOneAsync(rewardAttribute);
            return await GetRewardAttributes(rewardAttribute.Id);
        }

        [HttpGet("ref/{personallinkId}")]
        public async Task<ReferalResponse> GetReferalInfo(string personallinkId)
        {
            var referalCollection = _db.getCollection<Referal>();
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();

            var referalResponse = new ReferalResponse();
            var referal = await referalCollection.Find(r => r.PersonalLink == _config.GetSection("Domain:Name").Value +"ref/" + personallinkId).FirstAsync();
            if(referal != null)
            {
                var rewardAttribute = await GetRewardAttributes(referal.RewardId);
                referalResponse.RewardAttribute = rewardAttribute;

                if (referal.HasClaimed == false && (referal.AmountToClaim/rewardAttribute.AmountPaidPerClick) <= rewardAttribute.MaxPaidClicksPerUser)
                {
                    referal.AmountToClaim = referal.AmountToClaim + rewardAttribute.AmountPaidPerClick;
                    var updated = await referalCollection.UpdateOneAsync(r => r.Id == referal.Id,
                        Builders<Referal>.Update.Set(u => u.AmountToClaim, referal.AmountToClaim));

                    if (updated.MatchedCount != 1)
                    {
                        throw new Exception("failed to update referal");
                    }

                }

                referalResponse.Referal = referal;
            }

            return referalResponse;
        }

        [HttpPost("claimreward")]
        public async Task<ReferalResponse> ClaimReward([FromBody] RewardClaim rewardClaim)
        {
            if(String.IsNullOrWhiteSpace(rewardClaim.PersonalLink))
            {
                throw new Exception("personal link can not be empty");
            }

            if(String.IsNullOrWhiteSpace(rewardClaim.WalletAddress))
            {
                throw new Exception("Wallet address cannot be empty");
            }

            var referalCollection = _db.getCollection<Referal>();
            var referal = await referalCollection.Find(r => r.PersonalLink == System.Web.HttpUtility.UrlDecode(rewardClaim.PersonalLink) && r.WalletAddress == rewardClaim.WalletAddress).FirstOrDefaultAsync();
            
            if (referal == null)
            {
                throw new Exception("Referal not found");
            }

            var updated = await referalCollection.UpdateOneAsync(r => r.Id == referal.Id,
               Builders<Referal>.Update.Set(u => u.HasClaimed, true));

            var updated2 = await referalCollection.UpdateOneAsync(r => r.Id == referal.Id,
              Builders<Referal>.Update.Set(u => u.AmountToClaim, 0));

            if (updated.MatchedCount != 1)
            {
                throw new Exception("failed to update referal");
            }

            return await GetReferal(rewardClaim.PersonalLink);
        }

        [HttpPost("referal")]
        public async Task<ReferalResponse> CreateReferal([FromBody]Referal referal)
        {
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();
            var rewardAttribute = await rewardAttributeCollection.Find(w => w.Id == referal.RewardId).FirstOrDefaultAsync();

            if (rewardAttribute == null)
            {
                throw new Exception("No reward found");
            }

            var referalCollection = _db.getCollection<Referal>();
            var existingReferal = await referalCollection.Find(rr => rr.RewardId == referal.RewardId && rr.WalletAddress == referal.WalletAddress).FirstOrDefaultAsync();
            if (existingReferal != null)
            {
                return await GetReferal(existingReferal.PersonalLink);
            }

            if (rewardAttribute.NumberOfUsers < rewardAttribute.NumberOfUsersAbleToClaim)
            {
                rewardAttribute.NumberOfUsers = rewardAttribute.NumberOfUsers + 1;

                var updatedAtt = await rewardAttributeCollection.UpdateOneAsync(r => r.Id == rewardAttribute.Id,
               Builders<RewardAttribute>.Update.Set(u => u.NumberOfUsers, rewardAttribute.NumberOfUsers));

                if (updatedAtt.MatchedCount != 1)
                {
                    throw new Exception("failed to update referal");
                }
            }
            else
            {
                throw new Exception("Maximum number of users reached that can cliam reward");
            }

            await referalCollection.InsertOneAsync(referal);

            var ounce = referal.Id;
            var referalLink = _config.GetSection("Domain:Name").Value +"ref/"+ ounce;

            var updated = await referalCollection.UpdateOneAsync(r => r.Id == referal.Id,
               Builders<Referal>.Update.Set(u => u.PersonalLink, referalLink));

            if (updated.MatchedCount != 1)
            {
                throw new Exception("failed to update referal");
            }


            return await GetReferal(referalLink);
        }


        [HttpGet("referal/{walletaddress}")]
        public async Task<Referal[]> GetReferalInfoByWalletAddress(string walletaddress)
        {
            var referalCollection = _db.getCollection<Referal>();
            var referals = await referalCollection.Find(r => r.WalletAddress == walletaddress).ToListAsync();
            return referals.ToArray();
        }

        private async Task<ReferalResponse> GetReferal(string personallink)
        {
            var referalCollection = _db.getCollection<Referal>();
            var rewardAttributeCollection = _db.getCollection<RewardAttribute>();

            var referalResponse = new ReferalResponse();
            var referal = await referalCollection.Find(r => r.PersonalLink == System.Web.HttpUtility.UrlDecode(personallink)).FirstAsync();
            if (referal != null)
            {
                referalResponse.Referal = referal;

                var rewardAttribute = await GetRewardAttributes(referal.RewardId);
                referalResponse.RewardAttribute = rewardAttribute;
            }

            return referalResponse;
        }
    }
}
