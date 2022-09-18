import {ethers} from "ethers";

const generateId = (length = 20): string => {
   const randomBytes = ethers.utils.randomBytes(length)
   // omit 0x at the beginning & trim to requested size, as each byte is 2 chars long
   return ethers.utils.hexlify(randomBytes).substring(2, length + 2)
}

export {generateId}