/* import './CustomTask.css'; */
/* import * as React from 'react'; */
import { Input } from './Components/Input';
import { Button } from './Components/Button';
import { Badge } from './Components/Badge';
import { Label } from './Components/Label';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Interface } from 'readline';
import { useLocalStorage } from './Components/LocalStorageHook';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './Components/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./Components/Command"
import { Separator } from './Components/Separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Components/Dialog"

import { NewCardDialog } from './NewCardDialog';
import { Toolbar } from './Toolbar';
import Card from './Card';
import List from './List';
import Example from './DndList';


// Note to my forgetful future-self:
// localStorage is stored in $HOME/.config/port-moon/Local Storage/leveldb/000003.log
// the .log file is not human-readable
// maybe change the storage to local json file in the future?

interface Database {
  boards: Board[];
}


/*
Board types:
School
Personal
Work
This is annoying and not useful, use a lot of board instead lol
*/

interface Board {
  title: string;
  lists: List[];

  /*
  Feat: have a drag and drop area for label to the card
  like sticker, drag a label from the area to the card
  would add the label to the labels[]
  if the label from the card is dragged to the area
  (or somewhere other than the original card)
  => remove the label from the labels[]
  */
  /* labels: string[]; */
}

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

interface List {
  title: string;
  cards: Card[];
}

interface Card {
  id: number; // id = TaskDatabase.tasks[TaskDatabase.length - 1].id + 1;
  title: string;
  description: string;

  // Documentation, Bug, Feature, etc.
  labels?: string[];
  children?: Card[];

  // In Progress / 
  // Backlog / Waiting
  // Todo / Pending
  // Canceled / Deleted
  // Completed / Done
  status: string;

  priority?: string;
  /* urgency: number; */

  due?: string;

  // Is this necessary?
  /* entry: string; */
  /* modified: string; */
}

interface Setting {
  showTitle: boolean;
  showDescription: boolean;
  showLabel: boolean;
  showStatus: boolean;
  showPriority: boolean;
}

function TaskPage() {

  /* const [isOpen, setOpen] = useState( */
  /*   JSON.parse(localStorage.getItem('is-open') || 'false') */
  /* ); */
  /* useEffect(() => { */
  /*   localStorage.setItem('is-open', JSON.stringify(isOpen)); */
  /* }, [isOpen]); */

  /* const [isOpen, setOpen] = useLocalStorage('is-open', false); */
  const [boards, setBoards] = useLocalStorage<Board[]>('boards', []);
  /* const [newBoardTitle, setNewBoardTitle] = useState<string>("new board"); */

  return (
    <>
      {/* <div className="md:hidden"> */}
      {/* </div> */}
      <div className="font-sf flex-column space-y-8 p-8 width-full">
        <div className="flex items-center justify-between top-gap-05">
          <div>
            <h2 className="text-6 font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className="flex gap-2 top-gap-8">
          <Badge
            variant="primary"
            className=""
          >
            Primary Badge
          </Badge>
          <Badge
            variant="secondary"
            className=""
          >
            Secondary Badge
          </Badge>
          <Badge
            variant="outline"
            className=""
          >
            Outline
          </Badge>
        </div>


        <div className="flex-column gap-2 top-gap-2">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">New Board</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>New Board</DialogTitle>
                  <DialogDescription>
                    Description lorem ipsum
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-column gap-6">
                  <div className="flex-column gap-2">
                    <Label htmlFor="name" className="text-right">
                      Board Title
                    </Label>
                    <Input
                      id="name"
                      /* value={newBoardTitle} */
                      placeholder="board title go here"
                      className=""
                    />
                  </div>
                  <div className="flex-column gap-2">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    {/* <div className="text-sm font-medium leading-none"> */}
                    {/*   Username */}
                    {/* </div> */}
                    <Input id="username" value="@peduarte" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <NewCardDialog/>

          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="small"
                  className="border-dashed"
                  onClick={ () => {
                    /* console.log(isOpen); */
                  }}
                >
                  Board
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>
                      No results found.
                    </CommandEmpty>
                    <CommandGroup heading="">
                      <CommandItem
                        key={'port-moon'}
                        onSelect={() => {
                        }}
                      >
                        Port Moon
                      </CommandItem>
                      <CommandItem>
                        CSC 3102
                      </CommandItem>
                      <CommandItem>
                        Goals
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

          </div>

          <Card
            id={2}
            title=""
            description="content"
            status="todo"
          />

          <List title="List"/>

          <Example />

          <Toolbar/>
        </div>




      </div>
    </>
  )
}

export default TaskPage;

