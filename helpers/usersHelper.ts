import { getMaxListeners } from "process";

const jwt = require('jsonwebtoken');

const PRIVATE_KEY = "superSecretStringNowoneShouldKnowOrTheyCanGenerateTokens";

const calculateToken = (userEmail : string = "", userId : number = 0) => {
    return jwt.sign({email: userEmail, idUser: userId}, PRIVATE_KEY);
};

const decodeToken = (token : string) => {
    return jwt.decode(token);
};

// console.log(calculateToken('nico@gmail.com', 16));
// console.log(decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pY29AZ21haWwuY29tIiwiaWRVc2VyIjoxNiwiaWF0IjoxNjU0NjE3Mzk5fQ.m6XvznIb3YDx0Xt2Uy3REGPoBFq-DMJBvcsWE2KI3no'));


export { calculateToken, decodeToken };