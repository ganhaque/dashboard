import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon
} from "@radix-ui/react-icons";
/* import { Circle } from "lucide-react"; */

export const initialLabels = [
  {
    value: "bug",
    label: "Bug",
    backgroundColor: "red",
    color: "black",
  },
  {
    value: "feature",
    label: "Feature",
    backgroundColor: "teal",
    color: "black",
  },
  {
    value: "documentation",
    label: "Documentation",
    backgroundColor: "catppuccin_lavender",
    color: "black",
  },
]

// Create a lookup object that maps label values to colors
export const labelValueColorMap: { [key: string]: string } = {};
initialLabels.forEach((label) => {
  labelValueColorMap[label.value] = label.color;
});

export const labelValueBackgroundColorMap: { [key: string]: string } = {};
initialLabels.forEach((label) => {
  labelValueBackgroundColorMap[label.value] = label.backgroundColor;
});

interface Status {
  value: string;
  label: string;
  icon: React.ComponentType<any>; // Assuming your icon components are React components
}

export const initialStatuses: Status[] = [
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]

export const statusValueIconMap: { [key: string]: React.ComponentType<any> } = {};
initialStatuses.forEach((status) => {
  statusValueIconMap[status.value] = status.icon;
});

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: ArrowDownIcon,
  },
  {
    value: "medium",
    label: "Medium",
    icon: ArrowRightIcon,
  },
  {
    value: "high",
    label: "High",
    icon: ArrowUpIcon,
  },
];
export interface ChecklistProps {
}

export interface CardProps {
  id: string; // is also created date
  title: string;
  description?: string;

  due?: string;
  labels?: string[];

  /* children?: CardProps[]; */
  // or
  checklist?: ChecklistProps;

  duration?: string;

  // might remove
  /* status: string; */
}

export interface ListProps {
  droppableId: string;
  title: string;
  cards: CardProps[];

  description?: string;
}

export interface BoardProps {
  title: string;
  lists: ListProps[];

  description?: string;
}

export const exampleBoards: BoardProps[] = [
  {
    title: 'board1',
    lists: [
      {
        droppableId: 'list1',
        title: 'Example List 1',
        cards: [
          {
            id: '1689445701923',
            title: "You can't compress the program without quantifying the open-source SSD pixel!",
            /* status: "in progress", */
          },
          {
            id: '1689445706629',
            title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
            /* status: 'backlog' */
          },
          {
            id: '1689445713142',
            title: "The SMS interface is down, copy the bluetooth bus so we can quantify the VGA card!",
            /* status: 'todo', */
            labels: ["bug", "documentation", "feature"],
          },
          {
            id: '1689445718722',
            title: "Use the digital TLS panel, then you can transmit the haptic system!",
            /* status: 'done' */
          },
          {
            id: '1689445728973',
            title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
            /* status: 'canceled' */
          }
        ],
      },
      {
        droppableId: 'list2',
        title: 'Example List 2',
        cards: [
          {
            id: "TASK-7839",
            title: "We need to bypass the neural TCP card!",
            /* status: "todo", */
            labels: ["bug", "feature"],
            /* priority: "high" */
          },
          {
            id: "TASK-5562",
            title: "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
            /* status: "backlog", */
            labels: ["feature"],
            /* priority: "medium" */
          },
        ],
      },

    ]
  },
  {
    title: 'board2',
    lists: [
    ]
  }
];

export const exampleBoard: ListProps[] = [
  {
    droppableId: 'list1',
    title: 'Example List 1',
    cards: [
      {
        id: '1689445701923',
        title: "You can't compress the program without quantifying the open-source SSD pixel!",
        /* status: "in progress", */
      },
      {
        id: '1689445706629',
        title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
        /* status: 'backlog' */
      },
      {
        id: '1689445713142',
        title: "The SMS interface is down, copy the bluetooth bus so we can quantify the VGA card!",
        /* status: 'todo', */
        labels: ["bug", "documentation", "feature"],
      },
      {
        id: '1689445718722',
        title: "Use the digital TLS panel, then you can transmit the haptic system!",
        /* status: 'done' */
      },
      {
        id: '1689445728973',
        title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
        /* status: 'canceled' */
      }
    ],
  },
  {
    droppableId: 'list2',
    title: 'Example List 2',
    cards: [
      {
        id: "TASK-7839",
        title: "We need to bypass the neural TCP card!",
        /* status: "todo", */
        labels: ["bug", "feature"],
        /* priority: "high" */
      },
      {
        id: "TASK-5562",
        title: "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
        /* status: "backlog", */
        labels: ["feature"],
        /* priority: "medium" */
      },
    ],
  },
];

export interface SettingProps {
  showCardToolbar: boolean;
  /* showTitle: boolean; */
  /* showDescription: boolean; */
  /* showLabel: boolean; */
  /* showStatus: boolean; */
  /* showPriority: boolean; */
}

export const Settings: SettingProps = {
  showCardToolbar: true,
}

interface Setting {
  showTitle: boolean;
  showDescription: boolean;
  showLabel: boolean;
  showStatus: boolean;
  showPriority: boolean;
}



// Note to my forgetful future-self:
// localStorage is stored in $HOME/.config/port-moon/Local Storage/leveldb/000003.log
// the .log file is ~~~not~~~ human-readable
// maybe change the storage to local json file in the future?

/*
Board types:
School
Personal
Work
This is annoying and not useful, use a lot of board instead lol
*/

/*
List can be:
A large task that need to be break down into sub-tasks
List should not be:
Todo, In Progress, Done
That is dumb since it limits the user ability to make sub-tasks
There should be button to toggle/select between the states instead

Can I make it so that the data is stored in board like
and make the list based on the different attributes of the cards
like
list,
priority,
label, // no, because cards can have multiple labels
due // no, would be complex to divide the due date to minimize the amount of list

On board select:
for all cards in Board.cards {
  if (Board.selectedAttribute == 'list') {
    if (!Board.attributes[].has(cards.list))
  }
}

Scratch that, I think the different types of lists can already be handled by the filter
or by adding button to toggle between the states (refering to status and priority)
or would create error (label)

Store different statuses in Data.tsx to toggle between
*/
