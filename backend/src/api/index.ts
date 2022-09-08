import express from 'express'

const app = express();

const run = ({port = 4000}) => {
   //TODO: add routes definition here

   app.listen(port);
}

export default run
