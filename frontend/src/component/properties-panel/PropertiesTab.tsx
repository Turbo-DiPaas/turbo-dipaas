import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {useDispatch, useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {useEffect, useState} from "react";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {TabStruct} from "turbo-dipaas-common/src/types/api/design/TabStruct";
import {
   Button,
   Checkbox, CircularProgress,
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
import {activityToContractAbi, getAvailableContractFunctions} from "../../lib/evm/abiUtils";

function PropertiesTab (data) {
   const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
   const [selectedActivityStruct, setSelectedActivityStruct] = useState<ActivityDetailsStruct | undefined>()
   const [availableAssetOptions, setAvailableAssetOptions] = useState<AvailableAssetOptions | undefined>()
   const [resolvedAddresses, setResolvedAddresses] = useState<Map<string, Address[]>>(new Map())
   const [mapperParams, setMapperParams] = useState<Map<string, Map<string, Map<number, Param>>>>(new Map(new Map(new Map())))
   const [isResolvingAddress, setIsResolvingAddress] = useState<boolean>(false)
   const [addressResolveTimeout, setAddressResolveTimeout] = useState<any>(null)
   const {setNodes} = data;

   const addressResolver = new MultiAddressResolver()
   function resolveAddress(id: string, forField: string) {
      if (!id.startsWith('0x')) {
         clearTimeout(addressResolveTimeout)
         setAddressResolveTimeout(setTimeout(function () {
            setIsResolvingAddress(true)
            addressResolver.resolve(id).then((v) => {
               resolvedAddresses.clear()
               resolvedAddresses.set(forField, v)
               setResolvedAddresses(resolvedAddresses)
               setIsResolvingAddress(false)
            }).catch((e) => {
               setIsResolvingAddress(false)
            })
          }, 400))
      }
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

      const isStarterActivity = selectedActivityNode?.id === 'a0'

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

      setNodes((nds) => {return nds.map(el => {
         if(el.id === selectedActivityNode?.id || el.id===id) {
            return {...el, data: {...el.data, label: `${newType} (id: ${el.id})`}}
         }
         return el;
      })});
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

   function addMultiInputParam(fieldName: string) {
      if (selectedActivity) {
         const paramMap = (mapperParams.get(selectedActivity.id) ?? new Map())
             .get(fieldName) ?? new Map()
         setMultiInputParam('', fieldName, paramMap.size, true)
      }
   }

   function setMultiInputParam(newValue: any, fieldName: string, paramId: number | string, isKey: boolean) {
      if (selectedActivity) {
         const selectedActivityCopy: Activity = JSON.parse(JSON.stringify(selectedActivity))
         // mapping: activityId => fieldName => param
         const fieldMap = mapperParams.get(selectedActivity.id) ?? new Map()
         const paramMap = fieldMap.get(fieldName) ?? new Map()
         const param = paramMap.get(paramId) ?? {name: '', value: ''} as Param
         const newParam: Param = {...param}
         if (isKey) {
            newParam.name = newValue
         } else {
            newParam.value = newValue
         }

         paramMap.set(paramId, newParam)
         fieldMap.set(fieldName, paramMap)
         mapperParams.set(selectedActivity.id, fieldMap)

         selectedActivityCopy.params = []
         paramMap.forEach((v) => {
            selectedActivityCopy.params?.push(v)
         })

         setMapperParams(mapperParams)

         setSelectedActivity(selectedActivityCopy)
         upsertAsset(selectedActivityCopy)
      }
   }

   function setActivityResource(newValue: any) {
      if (selectedActivity && newValue.length > 0) {
         const resourcesMap = new Map()
         workflow.structure.resources.forEach((v) => {
            const matchingResCatalog = resourceCatalog.find((resCat) => resCat.type === v.type)
            const resWithCatalog = {resource: v, catalog: matchingResCatalog}
            resourcesMap.set(v.id, resWithCatalog)
         })

         const selectedActivityCopy: Activity = JSON.parse(JSON.stringify(selectedActivity))

         const newResource = resourcesMap.get(newValue)
         let oldResourceArrayId = -1

         if (!selectedActivityCopy.resources || selectedActivityCopy.resources.length === 0) {
            selectedActivityCopy.resources = [newValue]
         } else {
            selectedActivity!.resources?.forEach((v, i) => {
               const currentActivityResource = resourcesMap.get(v)
               if (currentActivityResource?.resource?.type === newResource?.resource?.type) {
                  oldResourceArrayId = i
               }
            })

            if (oldResourceArrayId >= 0) {
               selectedActivityCopy.resources![oldResourceArrayId] = newValue
            } else {
               selectedActivityCopy.resources!.push(newValue)
            }
         }

         setSelectedActivity(selectedActivityCopy)
         upsertAsset(selectedActivityCopy)
      }
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

   function setEVMMultiInputParam(newValue: any, fieldName: string, id: string) {
      if (selectedActivity && newValue) {
         const selectedActivityCopy: Activity = JSON.parse(JSON.stringify(selectedActivity))

         // setMultiInputParam(id, fieldName, id, true)
         // setMultiInputParam(newValue, fieldName, id, false)


         //NOTE
         //this is terrible copy-paste, but created quickly to finish before deadline
         // and get this thing to work (problems with useState being IMPLICITLY asynchronous
         // vvvvvvvvvvvvvvvvvvvvvvvvvvvvv

         const fieldMap = mapperParams.get(selectedActivity.id) ?? new Map()
         const paramMap = fieldMap.get(fieldName) ?? new Map()
         const param = paramMap.get(id) ?? {name: '', value: ''} as Param
         const newParam: Param = {...param}
         newParam.value = newValue

         paramMap.set(id, newParam)
         fieldMap.set(fieldName, paramMap)
         mapperParams.set(selectedActivity.id, fieldMap)

         setMapperParams(mapperParams)


         // ^^^^^^^^^^^^^^^^^^
         // end of terrible code





         const mergedParams = new Map()


         selectedActivityCopy?.params?.forEach((v) =>{
            mergedParams.set(v.name, v)
         })

         paramMap.forEach((v) =>{
            mergedParams.set(v.name, v)
         })
         // selectedActivityCopy.params = [...paramsToSave, {name: id, value: newValue}]
         selectedActivityCopy.params = []
         // @ts-ignore
         for (let [k, v] of mergedParams) {
            selectedActivityCopy.params.push(v)
         }

         setSelectedActivity(selectedActivityCopy)
         upsertAsset(selectedActivityCopy)
      }
   }

   function setEVMFunction(newValue: any, fieldName: string) {
      if (selectedActivity && newValue) {
         const selectedActivityCopy: Activity = JSON.parse(JSON.stringify(selectedActivity))
         // mapping: activityId => fieldName => param
         const fieldMap = mapperParams.get(selectedActivity.id) ?? new Map()
         const paramMap = fieldMap.get(fieldName) ?? new Map()
         paramMap.clear()

         const abi = activityToContractAbi(selectedActivityCopy, workflow.structure.resources)
         const params = []
         const functionToExecute = abi?.getFunction(newValue)
         const functionInputs = functionToExecute?.inputs ?? []
         functionInputs.forEach((v, i) => {
            const name = v.name ? v.name : `[${i}] (${v.type})`
            // @ts-ignore
            params.push(name)
            setMultiInputParam(name, fieldName, name, true)
         })

         setMultiInputParam(fieldName, fieldName, fieldName, true)
         setMultiInputParam(newValue, fieldName, fieldName, false)

         const paramsToSave = selectedActivityCopy?.params?.filter((v) => v.name === 'transactionRecipient') ?? []
         selectedActivityCopy.params = [...paramsToSave, {name: fieldName, value: newValue}]

         fieldMap.set(fieldName, paramMap)
         mapperParams.set(selectedActivity.id, fieldMap)

         setMapperParams(mapperParams)

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

         case InputFieldTypeEnum.EVM_ABI_FUNCTION:
            const paramsToSkip = new Map()
            const abiFieldsMap = mapperParams.get(selectedActivity!.id) ?? new Map()
            const abiParamMap = abiFieldsMap.get(field.name) ?? new Map()
            const abiParams: Param[] = []

             paramsToSkip.set('selectedFunction', '')

            abiParamMap.forEach((v) => {
               if (!paramsToSkip.has(v.name))
                  abiParams.push(v)
            })

            mappedFieldInput = (
                <div>
                   <Select id={id}
                           onChange={(e) => {setEVMFunction(e.target.value, field.name)}}>
                         <option/>
                      {getAvailableContractFunctions(selectedActivity!, workflow.structure.resources).map((v) => {
                         return <option value={v} selected={v === matchingParam?.value}>{v}</option>
                      })}
                   </Select>
                   <Grid templateColumns='repeat(6, 1fr)' gap={6}>
                      {
                         abiParams.map((v, i) => {
                            return (
                                <>
                                   <GridItem colSpan={2}>
                                      Name: <Input value={v.name} id={id}></Input>
                                   </GridItem>
                                   <GridItem colSpan={4}>
                                      Value: <Input value={v.value + '' ?? ''} id={id}
                                               onChange={(e) => {setEVMMultiInputParam(e.target.value, field.name, v.name)}}></Input>
                                   </GridItem>
                                </>
                            )})
                      }
                   </Grid>
                </div>)
            break

         case InputFieldTypeEnum.FREE_INPUT_LIST:
            const fieldsMap = mapperParams.get(selectedActivity!.id) ?? new Map()
            const paramMap = fieldsMap.get(field.name) ?? new Map()
            const params: Param[] = []

            paramMap.forEach((v) => params.push(v))

            mappedFieldInput = (
                <div>
                   <Button colorScheme='blue' variant='ghost'
                           onClick={() => {addMultiInputParam(field.name)}}>
                      add
                   </Button>
                   <Grid templateColumns='repeat(6, 1fr)' gap={6}>
                      {
                         params.map((v, i) => {
                            return (
                                <>
                                   <GridItem colSpan={2}>
                                      Name: <Input value={v.name} id={id}
                                                   onChange={(e) => {setMultiInputParam(e.target.value, field.name, i, true)}}></Input>
                                   </GridItem>
                                   <GridItem colSpan={4}>
                                      Value: <Input value={v.value + '' ?? ''} id={id}
                                                    onChange={(e) => {setMultiInputParam(e.target.value, field.name, i, false )}}></Input>
                                   </GridItem>
                                </>
                            )})
                      }
                   </Grid>
                </div>)
            break

         case InputFieldTypeEnum.ADDRESS:
            mappedFieldInput = (
                <Grid templateColumns='repeat(12, 1fr)' gap={6}>
                   <GridItem colSpan={5}>
                      Address: <Input id={id}
                                      value={matchingParam?.value ? matchingParam!.value + '' : ''}
                                      onChange={(e) => {resolveAddress(e.target.value, field.name); setActivityParam(e.target.value, field.name)}}></Input>
                   </GridItem>
                   <GridItem colSpan={1}>
                      <CircularProgress display={isResolvingAddress ? 'block' : 'none'} isIndeterminate color='green.300' />
                   </GridItem>
                   <GridItem colSpan={6}>
                      Resolved Address:
                      <Select
                          onChange={(e) => {setActivityParam(e.target.value, field.name)}}>
                         <option/>
                         {resolvedAddresses.get(field.name)?.map((v) => {
                            return <option value={v.address} selected={v.address === matchingParam?.value}>{v.type}: {v.address}</option>
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
                      {(field as unknown as SelectFieldStruct).options?.map((v) => {
                         return <option selected={v === matchingParam?.value}>{v}</option>
                      })}
                   </Select>
                </div>)
            break

         case InputFieldTypeEnum.RESOURCE_REF:
            const resourceType = (field as unknown as ResourceSelectFieldStruct).resourceType
            mappedFieldInput = (
                <div>
                   <Select id={id}
                           onChange={(e) => {setActivityResource(e.target.value)}}
                           value={workflow.structure.resources.filter((v) => {
                              return v.type === resourceType
                           }).map((v) => {
                              return selectedActivity?.resources?.find(selectedResource => selectedResource === v.id ) || ''
                              }).find((ww) => ww.length) || ''}
                              >
                      <option/>
                      {workflow.structure.resources.filter((v) => {
                         return v.type === resourceType
                      }).map((v, i) => {
                         return <option value={v.id} id={`${v.id}-${i}`}>{v.name}</option>
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