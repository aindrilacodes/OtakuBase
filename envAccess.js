import dotenv from "dotenv"
dotenv.config()

const PORT=process.env.PORT
const DB_URL=process.env.DB_URL
const TOKENSECRETKEY=process.env.TOKENSECRETKEY
const TOKENEXPIRY=process.env.TOKENEXPIRY

// const CLOUDNAME=process.env.CLOUDNAME
// const CLOUDAPISECRET=process.env.CLOUDAPISECRET
// const CLOUDAPIKEY=process.env.CLOUDAPIKEY
//,CLOUDAPIKEY,CLOUDAPISECRET,CLOUDNAME
export {PORT,DB_URL,TOKENEXPIRY,TOKENSECRETKEY}