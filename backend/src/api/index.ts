import express from 'express'
import swaggerUiExpress from 'swagger-ui-express'
import swaggerConfiguration from './OpenApiConfig'
import activitiesRouter from './routes/designer/activities'

const app = express();

const run = ({port = 4000}) => {
   //TODO: add routes definition here
   app.use(
      "/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerConfiguration)
   )
   app.use("/designer/activities", activitiesRouter);

   app.listen(port);
}

export default run
