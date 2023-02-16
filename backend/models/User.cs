using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace src.models
{
    [BsonIgnoreExtraElements]
    [MongoCollection("users")]
    public class User
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public string walletAddress { get; set; } = "";
    }
}
