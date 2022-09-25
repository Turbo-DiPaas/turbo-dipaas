import {createUseStyles} from 'react-jss';
import { Button, Heading, useDisclosure, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,   
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Divider,
  Tabs, 
  Input,
  Select,
  Checkbox,
  FormControl,
  FormLabel} from '@chakra-ui/react';
import { TabStruct } from 'turbo-dipaas-common/src/types/api/design/TabStruct';
import { FieldStruct, SelectFieldStruct } from 'turbo-dipaas-common/src/types/api/design/FieldStruct';
import { AssetType, InputFieldTypeEnum } from '../../types/enums/DesignStructEnum';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateReducer } from '../../types/interface/AppState';
import {setWorkflow} from "../../redux/reducers/workspaceNode";
import { ResourceDetailsStruct } from 'turbo-dipaas-common/src/types/api/design/ResourceStruct';
import { Resource } from 'turbo-dipaas-common/src/types/api/workflow/Resource';
import { Param } from 'turbo-dipaas-common/src/types/api/workflow/Param';

const useStyles = createUseStyles({
    addButton: {
        margin: '24px 0px'
       }
 });

 function AddNewResource( data :any) {
   const classes = useStyles();
   const { isOpen, onOpen, onClose, editedResource } = data;

   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const [selectedResource, setSelectedResource] = useState<Resource | undefined>();
   const [selectedResourceStruct, setSelectedResourceStruct] = useState<ResourceDetailsStruct | undefined>();
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const dispatch = useDispatch();

   useEffect(() => {
      const newResourceStruct = resourceCatalog.find((catalogEl) => catalogEl.type === editedResource?.type)
      const newResource: Resource = {
         type: newResourceStruct!?.type,
         name: editedResource?.name,
         id: editedResource?.id,
         params: editedResource?.params,
      }

      setSelectedResourceStruct(newResourceStruct)
      setSelectedResource(newResource)

   }, [isOpen])

   function changeResourceType (newType: string) {
      // @ts-ignore
      // setSelectedResourceStruct(resourceCatalog.find((catalogEl) => catalogEl.name === e.target.value))
      // const newResourceStruct = availableAssetOptions?.matchingAssetCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined
      const newResourceStruct = resourceCatalog.find((catalogEl) => catalogEl.name === newType)
      const newResource: Resource = {
         type: newResourceStruct!.type,
         name: newType,
         id: editedResource?.id || '',
         params: [],
      }

      setSelectedResourceStruct(newResourceStruct)
      setSelectedResource(newResource)
   }

   function saveForm() {
       //TODO: it won't work if there's possibility to remove resources, but it's good enough
      const resourceId = `r${workflow.structure.resources.length}`
      dispatch(setWorkflow({
         id: workflow.id,
         name: workflow.name,
         description: workflow.description,
         updated: Date.toString(),
         structure: {
            transitions: workflow.structure.transitions,
            activities: workflow.structure.activities,
            resources: editedResource ? workflow.structure.resources.map(el => {
               if(el.id === editedResource.id) {
                  return {
                     type: selectedResource!.type,
                     name: selectedResource!.name,
                     id: el.id,
                     params: selectedResource?.params,
                  } as Resource;
               } else {
                  return el;
               }}) : workflow.structure.resources.concat([{
                  type: selectedResource!.type,
                  name: `(${resourceId}) ${selectedResourceStruct!.name}`,
                  id: resourceId,
                  params: selectedResource?.params,
               } as Resource]),
         }
      }))
   }

   function setActivityParam(newValue: any, fieldName: string) {
      if (selectedResource) {
         const selectedResourceCopy: Resource = JSON.parse(JSON.stringify(selectedResource))
         const updatedParam: Param = { name: fieldName, value: newValue }
         const notMatchingParams = selectedResourceCopy.params?.filter((v) => v.name !== fieldName)
         if (selectedResourceCopy.params?.length !== notMatchingParams?.length) {
            selectedResourceCopy.params! = [...notMatchingParams ?? [], updatedParam]
         } else {
            selectedResourceCopy.params?.push(updatedParam)
         }
         setSelectedResource(selectedResourceCopy)
      }
   }

   
   function createField(field: FieldStruct, id: string) {
    let mappedFieldInput;
    const matchingParam = selectedResource?.params?.find((v) => v.name === field.name)

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

       case InputFieldTypeEnum.DROPDOWN:
          mappedFieldInput = (
             <div>
               <Select id={id}
                          onChange={(e) => {setActivityParam(e.target.value, field.name)}}></Select>
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
    
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editedResource ? 'Edit Resource' : 'Add New Resource'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
                <FormLabel>Asset type</FormLabel>
                <Select onChange={(e) => changeResourceType(e.target.value)} value={selectedResourceStruct?.name}>
                  <option></option>
                  {
                      resourceCatalog?.map((v) => {
                        return <option value={v.name}>{v.name}</option>
                      })
                  }
                </Select>
            </FormControl>
            <Tabs>
              <TabList>
                {
                    selectedResourceStruct?.structure.tabs.map((v) => {
                      return <Tab>{v.name}</Tab>
                    })
                }
              </TabList>

              <TabPanels>
                {
                    selectedResourceStruct?.structure.tabs.map((v) => {
                      return (
                          <TabPanel>
                            {createPropertiesTab(v)}
                          </TabPanel>)
                    })
                }
              </TabPanels>
          </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {saveForm(); onClose(); }}>
               {editedResource ? 'Edit' : 'Add'}
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
      
   );
 }
 export default AddNewResource