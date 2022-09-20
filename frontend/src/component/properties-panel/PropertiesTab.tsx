import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {Resource} from "turbo-dipaas-common/src/types/api/workflow/Resource";
import {useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {useEffect, useState} from "react";
import GeneralPanel from "./GeneralPanel";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";

type TabType = 'general' | 'input' | 'output'

type InputProps = {
   activity?: Activity,
   resource?: Resource,
}

function PropertiesTab (props: InputProps) {
   const activityCatalog = useSelector((state: AppStateReducer) => state.app.activityCatalog);
   const resourceCatalog = useSelector((state: AppStateReducer) => state.app.resourcesCatalog);
   const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const [selectedTab, setSelectedTab] = useState<TabType>('general')

   useEffect(() => {
      const matchingActivity = workflow.structure.activities?.find((v) => {return selectedActivityNode?.id === v.id})
      const matchingActivityStruct = activityCatalog.find((v) => {return matchingActivity?.type === v.type})
      // matchingActivityStruct.structure.tabs[0].

   }, [selectedActivityNode])

   const matchingActivityStructure = activityCatalog.find((v) => {
      return v.type === props?.activity?.type
   })

   const toggleNextPanel = () => {
      if(selectedTab === 'general') {
         setSelectedTab('input')
      } else if(selectedTab === 'input') {
         setSelectedTab('output')
      } else {
         setSelectedTab('general')
      }
   }

   return(
      <>
         <button onClick={toggleNextPanel}>Toggle</button>
         <p>PropertiesTab</p>
         {selectedTab === 'general' &&
            <GeneralPanel />}

         {selectedTab === 'input' &&
             <InputPanel />}

         {selectedTab === 'output' &&
             <OutputPanel />}
      </>
   )

}

export default PropertiesTab