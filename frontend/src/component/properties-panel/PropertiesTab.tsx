import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {Resource} from "turbo-dipaas-common/src/types/api/workflow/Resource";
import {useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {useEffect, useState} from "react";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {TabStruct} from "turbo-dipaas-common/src/types/api/design/TabStruct";
import {
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   FormControl,
   Input,
   Checkbox,
   Select,
   FormLabel, Divider
} from '@chakra-ui/react'
import {
   FieldStruct,
   ResourceSelectFieldStruct,
   SelectFieldStruct
} from "turbo-dipaas-common/src/types/api/design/FieldStruct";
//TODO: resolve issues with enums from common package
import {InputFieldTypeEnum} from "../../types/enums/DesignStructEnum";

function PropertiesTab () {
   const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
   const [selectedActivityStruct, setSelectedActivityStruct] = useState<ActivityDetailsStruct | undefined>()
   const [selectedPane, setSelectedPane] = useState<number>(0)

   useEffect(() => {
      const matchingActivity = workflow.structure.activities?.find((v) => {return selectedActivityNode?.id === v.id})
      const matchingActivityStruct = activityCatalog.find((v) => {return matchingActivity?.type === v.type})

      setSelectedActivity(matchingActivity)
      setSelectedActivityStruct(matchingActivityStruct)

   }, [selectedActivityNode])

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
      <>
         <br/>{selectedActivityNode?.id}
         <Tabs>
            <TabList>
               {
                  selectedActivityStruct?.structure.tabs.map((v, i) => {
                     return <Tab>{v.name}</Tab>
                  })
               }
            </TabList>

            <TabPanels>
               {
                  selectedActivityStruct?.structure.tabs.map((v, i) => {
                     return (
                        <TabPanel>
                           {createPropertiesTab(selectedActivityStruct?.structure.tabs[selectedPane])}
                        </TabPanel>)
                  })
               }
            </TabPanels>
         </Tabs>
      </>
   )

}

export default PropertiesTab