// const crypto = require('crypto');
import crypto from 'crypto';

const PRIVATE_KEY = "superSecretStringNowoneShouldKnowOrTheyCanGenerateTokens";

const calculateToken = (userEmail = "") => {
    return crypto.createHash('md5').update(userEmail + PRIVATE_KEY).digest("hex");
};

console.log(calculateToken('firstEmail@gmail.com'));

export { calculateToken };