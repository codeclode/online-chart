import { Grid } from "@mui/material";
import { DSVRowArray } from "d3";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { AppHeader } from "~/components/appHeader";
import { FileInput } from "~/components/fileInput";
import { CanvasWithOptions } from "~/components/optionsHeader";
import { DataType, DataTypeString } from "~/pages/utils/const/dataWorkers";
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
    <>
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
          <FileInput
            data={data}
            dataTypes={dataTypes}
            setData={setData}
            setDataTypes={setDataTypes}
            headerHeight={headerHeight}
          ></FileInput>
        </Grid>
        <Grid item xs>
          <CanvasWithOptions
            data={data}
            dataTypes={dataTypes}
            setData={setData}
            setDataTypes={setDataTypes}
            headerHeight={headerHeight}
          ></CanvasWithOptions>
        </Grid>
      </Grid>
    </>
  );
}
