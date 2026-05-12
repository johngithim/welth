import DashboardPage from "./page";
import { Suspense } from "react";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

const DashboardLayout = () => {
  return (
    // Default values shown

    <div className={"px-5"}>
      <Suspense
        fallback={
          <div
            className={"fixed inset-0 z-50 flex items-center justify-center"}
          >
            <Grid size="60" speed="1.5" color="black" />
            {/*<Quantum size="45" speed="1.75" color="black" />*/}
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};
export default DashboardLayout;
