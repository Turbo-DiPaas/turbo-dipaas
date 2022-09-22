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

const useStyles = createUseStyles({
    addButton: {
        margin: '24px 0px'
       }
 });

 function AddNewResource({ data }:any) {
   const classes = useStyles();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const [selectedResource, setSelectedResource] = useState<Resource | undefined>();
   const [selectedResourceStruct, setSelectedResourceStruct] = useState<ResourceDetailsStruct | undefined>();
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const dispatch = useDispatch();

   useEffect(() => {}, [])

   function upsertAsset(id: string | undefined, newType: string) {
        const notMatchingResources: Resource[] = []
        workflow.structure.resources.forEach((v) => {
          if(v.id === id) {
            // matchingResources = v
          } else {
            notMatchingResources.push(v)
          }
        })

        // @ts-ignore
        const newResourceStruct = resourceCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined
        const newResource: Resource = {
           type: newResourceStruct!.type,
           name: newType,
           id: (Math.random() * 1000).toString(),
           params: [],
        }

        dispatch(setWorkflow({
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          updated: Date.toString(),
          structure: {
              resources: [...notMatchingResources, newResource],
              transitions: workflow.structure.transitions,
              activities: workflow.structure.activities,
          }
        }))
    }

   
   function createField(field: FieldStruct, id: string) {
    let mappedFieldInput;
    const matchingParam = selectedResource?.params?.find((v) => v.name === field.name)

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
    <Button onClick={onOpen} className={classes.addButton} colorScheme='blue'>+ add resource</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
                <FormLabel>Asset type</FormLabel>
                {/* <Select onChange={(e) => upsertAsset(selectedResourceStruct?.id, e.target.value)} value={selectedResourceStruct?.name}></Select> */}
                {/* todo catalogEl search by id not name */}
                <Select onChange={(e) => setSelectedResourceStruct(resourceCatalog.find((catalogEl) => catalogEl.name === e.target.value))} value={selectedResourceStruct?.name}>
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
            <Button colorScheme='blue' mr={3} onClick={() => {upsertAsset(selectedResourceStruct?.id, selectedResourceStruct!.name); onClose(); }}>
              Save
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
   );
 }
 export default AddNewResource