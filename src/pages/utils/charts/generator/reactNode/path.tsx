import { useSnackbar } from "notistack";
import { useState, useContext, useEffect } from "react";
import { CanvasContext } from "~/components/canvas";
import { ChartDetailComponent } from "../util";

export const PATHDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};