import { Grid } from "@mui/material";
import { DSVRowArray } from "d3";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { AppHeader } from "~/components/appHeader";
import { FileInput } from "~/components/fileInput";
import { CanvasWithOptions } from "~/components/canvas";
import { DataTypeString } from "~/pages/utils/const/dataWorkers";

export const DataContext = createContext<{
  data: null | DSVRowArray<string>;
  setData: null | Dispatch<SetStateAction<DSVRowArray<string> | null>>;
  dataTypes: DataTypeString[] | null;
  setDataTypes: null | Dispatch<SetStateAction<DataTypeString[] | null>>;
}>({
  data: null,
  setData: null,
  dataTypes: null,
  setDataTypes: null,
});

export default function () {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [data, setData] = useState<null | DSVRowArray<string>>(null);
  const [dataTypes, setDataTypes] = useState<null | DataTypeString[]>(null);
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headerRef.current]);
  return (
    <DataContext.Provider value={{ data, setData, dataTypes, setDataTypes }}>
      <AppHeader ref={headerRef}></AppHeader>
      <Grid
        sx={{
          height: `calc(100vh - ${headerHeight + 25}px)`,
          m: "0",
          mt: "25px",
          px: "15px",
          overflow: "auto",
        }}
        container
        columns={24}
      >
        <Grid item xs="auto">
          <FileInput headerHeight={headerHeight}></FileInput>
        </Grid>
        <Grid item xs>
          <CanvasWithOptions headerHeight={headerHeight}></CanvasWithOptions>
        </Grid>
      </Grid>
    </DataContext.Provider>
  );
}
