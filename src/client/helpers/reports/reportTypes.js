import { FileText, AlertTriangle, Wrench, PieChart, User, History } from "lucide-react";

const reportTypes = [
    {
      title: "All Holdings",
      description:
        "View a complete list of the library's holdings and all details including condition, notes, acquisition date, etc.",
      icon: <FileText size={24} />,
      type: "all",
    },
    {
      title: "Missing Parts",
      description:
        "Identify all holdings that contain missing parts. Helps to plan replacement purchases.",
      icon: <AlertTriangle size={24} />,
      type: "missing",
    },
    {
      title: "Poor Condition",
      description:
        "Track items that are in poor or fair condition. Prioritize repairs or replacements to maintain integrity.",
      icon: <Wrench size={24} />,
      type: "poor-condition",
    },
    {
      title: "Condition Summary",
      description:
        "Get a snapshot of the overall condition of your holdings. Monitor the health of your library over time.",
      icon: <PieChart size={24} />,
      type: "condition-summary",
    },
    {
      title: "By Composer",
      description:
        "Filter the collection by composer to see which pieces you have from each one.",
      icon: <User size={24} />,
      type: "music-by-composer",
    },
    {
      title: "Performance History",
      description:
        "Review the history of performances tied to specific pieces. Track usage and plan future programs.",
      icon: <History size={24} />,
      type: "performance-history",
    },
  ];

export default reportTypes;