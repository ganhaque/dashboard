/* import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons" */
/* import { Input } from './Components/Input'; */
/* import { Button } from './Components/Button'; */
/* import { Label } from './Components/Label'; */
/* import { */
/*   Popover, */
/*   PopoverContent, */
/*   PopoverTrigger, */
/* } from './Components/Popover'; */
/* import { */
/*   Command, */
/*   CommandEmpty, */
/*   CommandGroup, */
/*   CommandInput, */
/*   CommandItem, */
/*   CommandList, */
/*   CommandSeparator, */
/* } from "./Components/Command" */
/* import { */
/*   Dialog, */
/*   DialogContent, */
/*   DialogDescription, */
/*   DialogFooter, */
/*   DialogHeader, */
/*   DialogTitle, */
/*   DialogTrigger, */
/* } from "./Components/Dialog" */
/* import { Separator } from "./Components/Separator"; */
/**/
/* import { statuses, labels } from './Data'; */
/* import { Badge } from "./Components/Badge"; */
/**/
/**/
/* export function NewCardTodo() { */
/*   return ( */
/*     <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}> */
/*       <PopoverTrigger asChild> */
/*         <Button */
/*           variant="outline" */
/*           size="" */
/*           className="border-dashed" */
/*         > */
/*           {newCardStatus} */
/*           <CaretSortIcon style={{ */
/*             marginLeft:"0.5rem", */
/*             height:"1rem", */
/*             width:"1rem", */
/*             flexShrink:"0", */
/*             opacity:"0.5", */
/*           }}/> */
/*         </Button> */
/*       </PopoverTrigger> */
/*       <PopoverContent */
/*         style={{width:"10rem"}} */
/*         className="z-50 black-bg" align="start" */
/*       > */
/*         <Command className=""> */
/*           <CommandInput placeholder="Change card status..." /> */
/*           <CommandList> */
/*             <CommandEmpty> */
/*               No status found. */
/*             </CommandEmpty> */
/*             <CommandGroup heading=""> */
/*               {statuses.map((status) => { */
/*                 return ( */
/*                   <CommandItem */
/*                     key={status.value} */
/*                     onSelect={() => { */
/*                       setNewCardStatus(status.value); */
/*                       setIsStatusPopoverOpen(false); */
/*                     }} */
/*                   > */
/*                     {status.icon && ( */
/*                       <status.icon style={{ */
/*                         marginRight:"0.5rem", */
/*                         height:"1rem", */
/*                         width:"1rem", */
/*                         font:"hsla(var(--muted-foreground))" */
/*                       }}/> */
/*                     )} */
/*                     {status.label} */
/*                     <CheckIcon style={{ */
/*                       marginLeft:"auto", */
/*                       height:"1rem", */
/*                       width:"1rem", */
/*                       opacity:newCardStatus === status.value ? "1" : "0" */
/*                     }} */
/*                     /> */
/*                   </CommandItem> */
/*                 ) */
/*               })} */
/*             </CommandGroup> */
/*           </CommandList> */
/*         </Command> */
/*       </PopoverContent> */
/*     </Popover> */
/*   ) */
/**/
/* } */
/**/

export function z() {
}
