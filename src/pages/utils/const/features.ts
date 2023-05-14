import {
  AccessAlarm,
  AccessAlarmOutlined,
  CloudOffOutlined,
  ConstructionOutlined,
  ElectricBoltOutlined,
  SettingsOutlined,
  SvgIconComponent,
} from "@mui/icons-material";

export const features: {
  feature: string;
  info: string;
  icon: SvgIconComponent;
  iconColor: string;
}[] = [
  {
    feature: "慢速",
    info: "可能需要时间学习，不适合希望快速构建可视化图表的人。",
    icon: AccessAlarmOutlined,
    iconColor: "#8a897f",
  },
  {
    feature: "客制化",
    info: "使用D3引擎，更方便构建“奇怪的图表”。",
    icon: ConstructionOutlined,
    iconColor: "#f6d017",
  },
  {
    feature: "数据",
    info: "计算不在云端，所以只能保留结果而不是数据，当然，这非常安全。",
    icon: CloudOffOutlined,
    iconColor: "#acdd63",
  },
];
