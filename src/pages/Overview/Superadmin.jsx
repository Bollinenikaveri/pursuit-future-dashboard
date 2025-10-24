import React, { useEffect } from "react";
import OverviewComp from "../../components/Overview";
import total from "../../../public/OverView/Total.png";
import revenue from "../../../public/OverView/revenue.png";
import pending from "../../../public/OverView/pending.png";
import Payment from "../../components/Payment";
import AnnouncementsOverView from "../../components/AnnouncementsOverView";
import { useState } from "react";

export default function Superadmin() {
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    async function fetchIntern() {
      try {
        const res = await fetch("http://localhost:3000/api/userintern");
        const data = await res.json();

        const multiplyTotal = data.total * 100000;
        setTotalValue(multiplyTotal);
      } catch (error) {
        console.error("Error fetching intern count:", error);
      }
    }
    
    fetchIntern(); 
  }, []); 
  return (
    <div className="w-full hpx-4 py-6">
      <div className="flex gap-2">
        <OverviewComp
          title="Total Target"
          revenue={`Rs ${totalValue.toLocaleString()}`} 
          img="/OverView/revenue.png"
          className="  "
        ></OverviewComp>
        <OverviewComp
          title="Projected Revenue"
          revenue="Rs 1,00,000"
          img={total}
        ></OverviewComp>
        <OverviewComp
          title="Revenue Credited"
          revenue="Rs 50,000"
          img={revenue}
        ></OverviewComp>
        <OverviewComp
          title="Pending Revenue"
          revenue="Rs 50,000"
          img={pending}
        ></OverviewComp>
      </div>
      <div className="flex  mt-3 gap-3">
        <div className="flex-col">
          <OverviewComp title="Total Payment counts" revenue="50" />
          <Payment />
        </div>
        <div className="w-full">
          <AnnouncementsOverView />
        </div>
      </div>
    </div>
  );
}
