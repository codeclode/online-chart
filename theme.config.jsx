import { DocumentScannerRounded } from "@mui/icons-material";
import { Link } from "@mui/material";

export default {
  logo: <>
  <DocumentScannerRounded color="info"/>
  <span style={{ marginLeft: '.4em',color:"skyblue", fontWeight: 800 }}>
    onLine-chart
  </span>
  </>,
  feedback:{
    content:"问题反馈",
    useLink:()=>"https://github.com/codeclode/online-chart/issues/new"
  },
  project: {
    link: 'https://github.com/codeclode/online-chart'
  },
  editLink:{
    component:<a target="_blank" href="https://github.com/codeclode/online-chart" rel="noreferrer">fork</a>
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <span >
          waiting...
        </span>
        .
      </span>
    )
  }
}