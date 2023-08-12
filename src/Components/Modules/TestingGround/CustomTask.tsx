import { useState } from 'react';
import { Button } from './Components/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./Components/Command";
import { useLocalStorage } from './Components/LocalStorageHook';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from './Components/Popover';

import { BoardProps, exampleBoards, initialLabels, initialStatuses } from './Data';
import Board from './Board';
import { NewCardDialog } from './NewCardDialog';
import { Toolbar } from './Toolbar';
import { InputForm } from './FormDemo';
import { BoardProvider } from './BoardProvider';

function TaskPage() {
  /* const [boards, updateBoards] = useLocalStorage<BoardProps[]>('boards', exampleBoards); */
  /* const [selectedBoard, setSelectedBoard] = useLocalStorage<BoardProps>('selectedBoard', boards[0]); */

  const [statuses, addNewStatuses] = useLocalStorage('statuses', initialStatuses);
  const [labels, updateLabels] = useLocalStorage('labels', initialLabels);

  /* const handleBoardChange = (boardIndex: number) => { */
  /*   setSelectedBoardIndex(boardIndex); */
  /* }; */

  return (
    <>
      <div
        style={{
        }}
        className="flex-column space-y-8 p-8 width-full"
      >
        <div className="flex items-center justify-between top-gap-05">
          <div>
            <h2 className="font-sf text-6 font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>

        <div className="flex-column gap-2 top-gap-2">
          <div className="flex gap-2">
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
                      {/* {boards.map((board, index) => ( */}
                      {/*   <CommandItem */}
                      {/*     key={board.title} */}
                      {/*     onSelect={() => { */}
                      {/*       setSelectedBoardIndex(index) */}
                      {/*     }} */}
                      {/*   > */}
                      {/*     {board.title} */}
                      {/*   </CommandItem> */}
                      {/**/}
                      {/* ))} */}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

          </div>

          <Toolbar/>
          <InputForm/>
          {/* <Button variant='outline' onClick={() => {console.log(boards)}}>boards</Button> */}
          {/* <Button variant='outline' onClick={() => {console.log(selectedBoardIndex)}}>index</Button> */}

          <BoardProvider>
            <Board/>
          </BoardProvider>
        </div>


      </div>
    </>
  )
}

export default TaskPage;

