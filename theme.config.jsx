import { DocumentScannerRounded } from "@mui/icons-material";

export default {
  logo: <>
  <DocumentScannerRounded color="info"/>
  <span style={{ marginLeft: '.4em',color:"skyblue", fontWeight: 800 }}>
    onLine-chart
  </span>
  </>,
  project: {
    link: 'https://github.com/codeclode/online-chart'
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