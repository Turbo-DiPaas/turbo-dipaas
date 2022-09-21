import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {useDispatch, useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {useEffect, useState} from "react";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {TabStruct} from "turbo-dipaas-common/src/types/api/design/TabStruct";
import {
   Button,
   Checkbox,
   Divider,
   FormControl,
   FormLabel, Grid, GridItem,
   Input,
   Select,
   Tab,
   TabList,
   TabPanel,
   TabPanels,
   Tabs
} from '@chakra-ui/react'
import {
   FieldStruct,
   ResourceSelectFieldStruct,
   SelectFieldStruct
} from "turbo-dipaas-common/src/types/api/design/FieldStruct";
//TODO: resolve issues with enums from common package
import {AssetType, InputFieldTypeEnum} from "../../types/enums/DesignStructEnum";
import {AvailableAssetOptions} from "../../types/struct/AvailableAssetOptions";
import {setWorkflow} from "../../redux/reducers/workspaceNode";
import {TriggerActivityEnum} from "../../types/enums/DesignStructEnum";

function PropertiesTab () {
   const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
   const [selectedActivityStruct, setSelectedActivityStruct] = useState<ActivityDetailsStruct | undefined>()
   const [availableAssetOptions, setAvailableAssetOptions] = useState<AvailableAssetOptions | undefined>()

   const dispatch = useDispatch()

   useEffect(() => {
      const matchingActivity =
         selectedActivityNode ?
            workflow.structure.activities.find((v) => {return selectedActivityNode?.id === v.id})
            : undefined
      const matchingActivityStruct = activityCatalog.find((v) => {return matchingActivity?.type === v.type})

      setSelectedActivity(matchingActivity)
      setSelectedActivityStruct(matchingActivityStruct)

      const isStarterActivity = selectedActivityNode?.id === '0'

      const activitySubtype = isStarterActivity ? 'starter' : 'workflow'

      const matchingAssets = activityCatalog.filter((v) => {
         const isStarterActivityType = v.type.toString() === TriggerActivityEnum.SCHEDULER.toString() || v.type.toString() === TriggerActivityEnum.EVM_EVENT_SCHEDULER.toString()

         return isStarterActivity === isStarterActivityType
      })

      setAvailableAssetOptions({
         type: AssetType.ACTIVITY,
         subtype: activitySubtype,
         matchingAssetCatalog: matchingAssets,
      })

   }, [selectedActivityNode])

   function upsertAsset(id: string | undefined, newType: string) {
      const notMatchingActivities: Activity[] = []
      let matchingActivity: Activity | undefined = undefined

      workflow.structure.activities.forEach((v) => {
         if(v.id === id) {
            matchingActivity = v
         } else {
            notMatchingActivities.push(v)
         }
      })

      // @ts-ignore
      const newActivityStruct = availableAssetOptions?.matchingAssetCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined
      const newActivity: Activity = {
         type: newActivityStruct!.type,
         name: newType,
         id: selectedActivityNode!.id,
         params: [],
         position: selectedActivityNode!.position!
      }

      dispatch(setWorkflow({
         id: workflow.id,
         name: workflow.name,
         description: workflow.description,
         updated: Date.toString(),
         structure: {
            resources: workflow.structure.resources,
            transitions: workflow.structure.transitions,
            activities: [... notMatchingActivities, newActivity ]
         }
      }))

      setSelectedActivityStruct(newActivityStruct)
      setSelectedActivity(newActivity)
   }

   function createField(field: FieldStruct, id: string) {
      let mappedFieldInput;
      const matchingParam = selectedActivity?.params?.find((v) => v.name === field.name)

      switch (field.type) {
         case InputFieldTypeEnum.FREE_INPUT:
            mappedFieldInput = (
               <div>
                  <Input id={id} onChange={(e) => {console.log({e})}} value={matchingParam?.value ? matchingParam!.value + '' : ''}></Input>
               </div>)
            break

         case InputFieldTypeEnum.BOOLEAN:
            mappedFieldInput = (
               <div>
                  <Checkbox id={id} checked={matchingParam?.value === true}></Checkbox>
               </div>)
            break

         case InputFieldTypeEnum.FREE_INPUT_LIST:
            mappedFieldInput = (
               <div>
                  <Grid templateColumns='repeat(7, 1fr)' gap={6}>
                     <GridItem colSpan={3}>
                        Name: <Input id={id} onChange={(e) => {console.log({e})}}></Input>
                     </GridItem>
                     <GridItem colSpan={3}>
                        Value: <Input id={id} onChange={(e) => {console.log({e})}}></Input>
                     </GridItem>
                     <GridItem>
                        <Button>++</Button>
                     </GridItem>
                  </Grid>
               </div>)
            break

         case InputFieldTypeEnum.DROPDOWN:
            mappedFieldInput = (
               <div>
                  <Select id={id}>
                     {(field as unknown as SelectFieldStruct).options.map((v) => {
                        return <option selected={v === matchingParam?.value}>{v}</option>
                     })}
                  </Select>
               </div>)
            break

         case InputFieldTypeEnum.RESOURCE_REF:
            mappedFieldInput = (
               <div>
                  <Select id={id}>
                     {workflow.structure.resources.filter((v) => {
                        return v.type === (field as unknown as ResourceSelectFieldStruct).resourceType
                     }).map((v) => {
                        return <option id={v.id}>{v.name}</option>
                     })}
                  </Select>
               </div>)
            break

         default:
            mappedFieldInput = (<></>)
            break
      }

      return (
         <FormControl>
            <FormLabel>{field.displayName}</FormLabel>
            {mappedFieldInput}
         </FormControl>
      )
   }

   function createPropertiesTab(tab?: TabStruct) {
      if (!tab) return <div/>

      return (
         <div>
            <>
               <h2>{tab.type} {tab.name}</h2>
               <p>{tab.description}</p>
               <Divider />
               {tab.fields.map((v, i) => {
                  return createField(v, `${v.name}-${i}`)
               })}
            </>
         </div>
      )
   }

   return (
      <div>
         <FormControl>
            <FormLabel>Asset type</FormLabel>
            <Select onChange={(e) => upsertAsset(selectedActivity?.id, e.target.value)} value={selectedActivityStruct?.name}>
               <option></option>
               {
                  availableAssetOptions?.matchingAssetCatalog?.map((v) => {
                     return <option value={v.name}>{v.name}</option>
                  })
               }
            </Select>
         </FormControl>
         <Tabs>
            <TabList>
               {
                  selectedActivityStruct?.structure.tabs.map((v) => {
                     return <Tab>{v.name}</Tab>
                  })
               }
            </TabList>

            <TabPanels>
               {
                  selectedActivityStruct?.structure.tabs.map((v) => {
                     return (
                        <TabPanel>
                           {createPropertiesTab(v)}
                        </TabPanel>)
                  })
               }
            </TabPanels>
         </Tabs>
      </div>
   )

}

export default PropertiesTab