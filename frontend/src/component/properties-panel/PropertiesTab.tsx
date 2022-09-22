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
import {Param} from "../../../../common/src/types/api/workflow/Param";
import MultiAddressResolver from "../../service/address-resolver/AddressResolver";
import {Address} from "../../types/struct/Address";

function PropertiesTab () {
   const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
   const [selectedActivityStruct, setSelectedActivityStruct] = useState<ActivityDetailsStruct | undefined>()
   const [availableAssetOptions, setAvailableAssetOptions] = useState<AvailableAssetOptions | undefined>()
   const [resolvedAddresses, setResolvedAddresses] = useState<Map<string, Address[]>>(new Map())

   const addressResolver = new MultiAddressResolver()
   function resolveAddress(id: string, forField: string) {
      addressResolver.resolve(id).then((v) => {
         resolvedAddresses.set(forField, v)
         setResolvedAddresses(resolvedAddresses)
      })
   }

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

   function changeActivityType (id: string | undefined, newType: string) {
      // @ts-ignore
      const newActivityStruct = availableAssetOptions?.matchingAssetCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined
      const newActivity: Activity = {
         type: newActivityStruct!.type,
         name: newType,
         id: selectedActivityNode?.id ?? id ?? '',
         params: [],
         position: selectedActivityNode?.position!
      }

      upsertAsset(newActivity)

      setSelectedActivityStruct(newActivityStruct)
      setSelectedActivity(newActivity)
   }

   function upsertAsset(newAsset: Activity) {
      const notMatchingActivities = workflow.structure.activities.filter((v) => v.id !== newAsset.id)

      dispatch(setWorkflow({
         id: workflow.id,
         name: workflow.name,
         description: workflow.description,
         updated: new Date().toDateString(),
         structure: {
            resources: workflow.structure.resources,
            transitions: workflow.structure.transitions,
            activities: [... notMatchingActivities, newAsset ]
         }
      }))
   }

   function setActivityParam(newValue: any, fieldName: string) {
      if (selectedActivity) {
         const selectedActivityCopy: Activity = JSON.parse(JSON.stringify(selectedActivity))
         const updatedParam: Param = { name: fieldName, value: newValue }
         const notMatchingParams = selectedActivityCopy.params?.filter((v) => v.name !== fieldName)
         if (selectedActivityCopy.params?.length !== notMatchingParams?.length) {
            selectedActivityCopy.params! = [...notMatchingParams ?? [], updatedParam]
         } else {
            selectedActivityCopy.params?.push(updatedParam)
         }
         setSelectedActivity(selectedActivityCopy)
         upsertAsset(selectedActivityCopy)
      }
   }

   function createField(field: FieldStruct, id: string) {
      let mappedFieldInput;
      const matchingParam = selectedActivity?.params?.find((v) => v.name === field.name)

      switch (field.type) {
         case InputFieldTypeEnum.FREE_INPUT:
            mappedFieldInput = (
               <div>
                  <Input id={id}
                         onChange={(e) => {setActivityParam(e.target.value, field.name)}}
                         value={matchingParam?.value ? matchingParam!.value + '' : ''}>
                  </Input>
               </div>)
            break

         case InputFieldTypeEnum.BOOLEAN:
            mappedFieldInput = (
               <div>
                  <Checkbox id={id}
                            onChange={(e) => {setActivityParam(e.target.checked, field.name)}}
                            isChecked={matchingParam?.value === true}></Checkbox>
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

         case InputFieldTypeEnum.ADDRESS:
            mappedFieldInput = (
                   <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                      <GridItem>
                         Address: <Input id={id}
                                      value={matchingParam?.value ? matchingParam!.value + '' : ''}
                                      onChange={(e) => {resolveAddress(e.target.value, field.name)}}></Input>
                      </GridItem>
                      <GridItem>
                         Resolved Address:
                         <Select
                             onChange={(e) => {setActivityParam(e.target.value, field.name)}}>
                            <option/>
                            {resolvedAddresses.get(field.name)?.map((v) => {
                               return <option selected={v.address === matchingParam?.value}>{v.address}</option>
                            })}
                         </Select>
                      </GridItem>
                   </Grid>)
            break

         case InputFieldTypeEnum.DROPDOWN:
            mappedFieldInput = (
               <div>
                  <Select id={id}
                          onChange={(e) => {setActivityParam(e.target.value, field.name)}}>
                     {(field as unknown as SelectFieldStruct).options.map((v) => {
                        return <option selected={v === matchingParam?.value}>{v}</option>
                     })}
                  </Select>
               </div>)
            break

         case InputFieldTypeEnum.RESOURCE_REF:
            mappedFieldInput = (
               <div>
                  <Select id={id}
                          onChange={(e) => {setActivityParam(e.target.value, field.name)}}>
                     {workflow.structure.resources.filter((v) => {
                        return v.type === (field as unknown as ResourceSelectFieldStruct).resourceType
                     }).map((v) => {
                        return <option value={v.id} id={v.id}>{v.name}</option>
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
               {/* <h2>{tab.type} {tab.name}</h2>
               <p>{tab.description}</p> */}
               <Divider />
               {tab.fields.map((v, i) => {
                  return createField(v, `${v.name}-${i}`)
               })}
            </>
         </div>
      )
   }

   return (
      <div style={{padding: '16px'}}>
         <FormControl>
            <FormLabel>Asset type</FormLabel>
            <Select onChange={(e) => changeActivityType(selectedActivity?.id, e.target.value)} value={selectedActivityStruct?.name}>
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