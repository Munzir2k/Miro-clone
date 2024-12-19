'use client';
import {Hint} from '@/components/Hint';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {CreateOrganization} from '@clerk/nextjs';
import {Plus} from 'lucide-react';

function NewButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint
            label="Create Organization"
            side="right"
            align="start"
            sideOffset={18}>
            <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
              <Plus />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[430px] bg-transparent border-none">
        <CreateOrganization routing="hash" />
      </DialogContent>
    </Dialog>
  );
}

export default NewButton;
