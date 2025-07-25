"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProjectAction } from '@/app/actions/projects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Project, Contact } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
    </Button>
  );
}

interface EditProjectFormProps {
    project: Project;
    contacts: Contact[];
    setOpen: (open: boolean) => void;
}

export function EditProjectForm({ project, contacts, setOpen }: EditProjectFormProps) {
    const [state, formAction] = useActionState(updateProjectAction, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success === true) {
            toast({ title: 'Success!', description: state.message });
            setOpen(false);
        } else if (state?.success === false && state.message) {
            const errorMessages = state.errors ? Object.values(state.errors).flat().join('\n') : '';
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `${state.message}\n${errorMessages}`,
            });
        }
    }, [state, toast, setOpen]);
    
    const formattedDeadline = project.deadline ? new Date(project.deadline).toISOString().substring(0, 10) : '';

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="id" value={project.id} />
             <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" defaultValue={project.name} required />
                {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="applicationNumber">Application Number (Optional)</Label>
                <Input id="applicationNumber" name="applicationNumber" defaultValue={project.applicationNumber || ''} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="ownerContactId">Owner / Beneficiary</Label>
                <Select name="ownerContactId" defaultValue={project.ownerContactId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an owner" />
                    </SelectTrigger>
                    <SelectContent>
                        {contacts.filter(c => c.role === 'Client').map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                                {contact.firstName} {contact.lastName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {state.errors?.ownerContactId && <p className="text-sm font-medium text-destructive mt-1">{state.errors.ownerContactId[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="deadline">Project Deadline (Optional)</Label>
                <Input id="deadline" name="deadline" type="date" defaultValue={formattedDeadline} />
            </div>
            <SubmitButton />
        </form>
    );
}
