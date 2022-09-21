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
import { AvailableAssetOptions } from '../../types/struct/AvailableAssetOptions';
import { Resource } from 'turbo-dipaas-common/src/types/api/workflow/Resource';
import { Activity } from 'turbo-dipaas-common/src/types/api/workflow/Activity';
import AddNewResource from './AddNewResource';

const useStyles = createUseStyles({
  container: {
    textAlign: 'center'
   },
   addButton: {
    margin: '24px 0px'
   }
 });

 function ResourcesPanel({ data }:any) {
   const classes = useStyles();
   // const { isOpen, onOpen, onClose } = useDisclosure();

//    const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resources = useSelector((state: AppStateReducer) => state.app.workflow.structure.resources);
   console.log(resources);
//    // const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
//    const [selectedResource, setSelectedResource] = useState<Resource | undefined>();
//    const [selectedResourceStruct, setSelectedResourceStruct] = useState<ResourceDetailsStruct | undefined>();
//    // const [availableAssetOptions, setAvailableAssetOptions] = useState<AvailableAssetOptions | undefined>();
//    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
//    const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
//    const dispatch = useDispatch();

//    useEffect(() => {}, [])

//    function upsertAsset(id: string | undefined, newType: string) {
//         const notMatchingResources: Resource[] = []
//       //   let matchingResources: Resource | undefined = undefined

//         workflow.structure.resources.forEach((v) => {
//           if(v.id === id) {
//             // matchingResources = v
//           } else {
//             notMatchingResources.push(v)
//           }
//         })

//         // @ts-ignore
//         const newResourceStruct = resourceCatalog?.find((v) => {return v.name === newType}) as ActivityDetailsStruct | undefined
//         const newResource: Resource = {
//            type: newResourceStruct!.type,
//            name: newType,
//            id: (Math.random() * 1000).toString(),
//            params: [],
//         }

//         dispatch(setWorkflow({
//           id: workflow.id,
//           name: workflow.name,
//           description: workflow.description,
//           updated: Date.toString(),
//           structure: {
//               resources: [...notMatchingResources, newResource],
//               transitions: workflow.structure.transitions,
//               activities: workflow.structure.activities,
//           }
//         }))
//     }

   
//    function createField(field: FieldStruct, id: string) {
//     let mappedFieldInput;
//     const matchingParam = selectedResource?.params?.find((v) => v.name === field.name)

//     switch (field.type) {
//        case InputFieldTypeEnum.FREE_INPUT:
//           mappedFieldInput = (
//              <div>
//                 <Input id={id} onChange={(e) => {console.log({e})}} value={matchingParam?.value ? matchingParam!.value + '' : ''}></Input>
//              </div>)
//           break

//        case InputFieldTypeEnum.BOOLEAN:
//           mappedFieldInput = (
//              <div>
//                 <Checkbox id={id} checked={matchingParam?.value === true}></Checkbox>
//              </div>)
//           break

//        case InputFieldTypeEnum.DROPDOWN:
//           mappedFieldInput = (
//              <div>
//                 <Select id={id}>
//                    {(field as unknown as SelectFieldStruct).options.map((v) => {
//                       return <option selected={v === matchingParam?.value}>{v}</option>
//                    })}
//                 </Select>
//              </div>)
//           break

 
//        default:
//           mappedFieldInput = (<></>)
//           break
//     }

//     return (
//        <FormControl>
//           <FormLabel>{field.name}</FormLabel>
//           {mappedFieldInput}
//        </FormControl>
//     )
//  }
   
//    function createPropertiesTab(tab?: TabStruct) {
//     if (!tab) return <div/>

//     return (
//        <div>
//           <>
//              <h2>{tab.type} {tab.name}</h2>
//              <p>{tab.description}</p>
//              <Divider />
//              {tab.fields.map((v, i) => {
//                 return createField(v, `${v.name}-${i}`)
//              })}
//           </>
//        </div>
//     )
//  }

 
   return (
     <div className={classes.container}>
        <Heading as='h4' size='md'>Resources</Heading>
        <AddNewResource/>
        {resources.map((el) => 
            <div style={{marginBottom: '8px', float: 'left'}}>
               <Button style={{float: 'left'}} colorScheme='blue' variant='ghost' size='sm'>
               edit
               </Button>
               <Button style={{maxWidth: '250px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              width: '180px',
                              whiteSpace: 'nowrap',
                              float: 'left',
                              display: 'inline-block',
                              marginLeft: '8px'
            }} colorScheme='blue' variant='outline' size='sm'>
               {el.name}
               </Button>

            </div>)}
     </div>
   );
 }
 export default ResourcesPanel