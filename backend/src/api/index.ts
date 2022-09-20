import express from 'express'
import swaggerUiExpress from 'swagger-ui-express'
import cors from 'cors'
import swaggerConfiguration from './OpenApiConfig'
import activitiesRouter from './routes/designer/activities'
import resourcesRouter from './routes/designer/resources'
import workflowsRouter from './routes/runner/workflows'

const app = express();

const run = ({port = 4000}) => {
   //TODO: add routes definition here
   app.use(
      "/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerConfiguration)
   )
   app.use(cors())
   app.use(express.json());
   app.use("/designer/activities", activitiesRouter);
   app.use("/designer/resources", resourcesRouter);
   app.use("/runner/workflows", workflowsRouter)

   app.listen(port);
}

export default run
