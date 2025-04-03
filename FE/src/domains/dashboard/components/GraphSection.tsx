import React, { useState } from 'react';
import DashboardLine from './DashboardLine';
import GgumGraph from './GgumGraph';


const GraphSection = () => {


  return (
            <div className="flex flex-col gap-10">
            <div className="flex flex-col">
                <GgumGraph periodName={14} height="55%" />
            </div>
            <div className="flex flex-col">
                <GgumGraph periodName={30} height="55%" />
            </div>
          </div> 
  );
};

export default GraphSection;
