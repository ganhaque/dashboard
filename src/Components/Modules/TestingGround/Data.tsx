import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpCircle,
  ArrowUpToLine,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react"

/* export const labels = [ */
/*   { */
/*     value: "Bug", */
/*     label: "Bug", */
/*   }, */
/*   { */
/*     value: "Feature", */
/*     label: "Feature", */
/*   }, */
/*   { */
/*     value: "Documentation", */
/*     label: "Documentation", */
/*   }, */
/* ] */

export const statuses = [
  {
    value: "Backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "Todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "In progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "Done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "Canceled",
    label: "Canceled",
    icon: XCircle,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownToLine,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightToLine,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpToLine,
  },
]
