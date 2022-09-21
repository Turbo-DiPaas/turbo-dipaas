import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {useDispatch, useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {useEffect, useState} from "react";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {TabStruct} from "turbo-dipaas-common/src/types/api/design/TabStruct";
import {
   Checkbox,
   Divider,
   FormControl,
   FormLabel,
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
import {TriggerActivityEnum} from "../../types/enums/DesignStructEnum";
import {setWorkflow} from "../../redux/reducers/workspaceNode";

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
         return isStarterActivity === (v.type === TriggerActivityEnum.SCHEDULER)
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
      const newAssetType = availableAssetOptions?.matchingAssetCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined

      dispatch(setWorkflow({
         id: workflow.id,
         name: workflow.name,
         description: workflow.description,
         updated: Date.toString(),
         structure: {
            resources: workflow.structure.resources,
            transitions: workflow.structure.transitions,
            activities: [... notMatchingActivities, {
               type: newAssetType!.type,
               name: newType,
               id: selectedActivityNode!.id,
               params: [],
               position: selectedActivityNode!.position!
            }]
         }
      }))
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
            <FormLabel>{field.name}</FormLabel>
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
            <Select onChange={(e) => upsertAsset(selectedActivityStruct?.id, e.target.value)} value={selectedActivityStruct?.name}>
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