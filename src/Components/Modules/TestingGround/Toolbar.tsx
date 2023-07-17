import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from './Components/Input';
import { Button } from './Components/Button';
import { Label } from './Components/Label';
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

export function Toolbar() {
  const [filterValue, setFilterValue] = useState<string>("");

  return (

    <div className="flex items-center space-x-2 top-gap-2">
      <div className="flex items-center justify-between gap-2">
        <Input
          label="Filter"
          placeholder="Filter tasks..."
          value={filterValue ?? ""}
          onChange={(event) =>
            setFilterValue(event.target.value)
          }
          className=""
        />

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
              Label
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="">
                  <CommandItem
                    key={'calendar'}
                    onSelect={() => {
                      console.log('calendar');
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "1.25rem",
                        gap: "var(--gap-size)"
                      }}
                    >
                      <div>Calendar</div>
                      <Separator
                        orientation='vertical'
                      />
                      <div>Calendar</div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Launch</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="">
                  <CommandItem>
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Mail</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
              Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="">
                  <CommandItem
                    key={'calendar'}
                    onSelect={() => {
                      console.log('calendar');
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "1.25rem",
                        gap: "var(--gap-size)"
                      }}
                    >
                      <div>Calendar</div>
                      <Separator
                        orientation='vertical'
                      />
                      <div>Calendar</div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Launch</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="">
                  <CommandItem>
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Mail</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
              Priority
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="">
                  <CommandItem
                    key={'calendar'}
                    onSelect={() => {
                      console.log('calendar');
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "1.25rem",
                        gap: "var(--gap-size)"
                      }}
                    >
                      <div>Calendar</div>
                      <Separator
                        orientation='vertical'
                      />
                      <div>Calendar</div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Launch</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="">
                  <CommandItem>
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Mail</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

      </div>
    </div>
  )
}
