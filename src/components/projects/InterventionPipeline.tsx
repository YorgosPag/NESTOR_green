"use client";

import type { Stage, Contact, ProjectIntervention, Project } from "@/types";
import { StageCard } from "./StageCard";

interface InterventionPipelineProps {
  stages: Stage[];
  project: Project;
  allProjectInterventions: ProjectIntervention[];
  interventionName: string;
  contacts: Contact[];
  owner?: Contact;
  interventionMasterId: string;
}

const PipelineColumn = ({ title, stages, project, allProjectInterventions, interventionName, contacts, owner, interventionMasterId }: { title: string, stages: Stage[], project: Project, allProjectInterventions: ProjectIntervention[], interventionName: string, contacts: Contact[], owner?: Contact, interventionMasterId: string }) => (
  <div>
    <h3 className="font-semibold mb-3 px-2 text-muted-foreground">{title} ({stages.length})</h3>
    <div className="flex flex-col gap-3">
      {stages.map((stage, index) => (
        <StageCard 
            key={stage.id} 
            stage={stage} 
            project={project}
            allProjectInterventions={allProjectInterventions}
            interventionName={interventionName}
            contacts={contacts} 
            owner={owner}
            interventionMasterId={interventionMasterId}
            canMoveUp={index > 0}
            canMoveDown={index < stages.length - 1}
        />
      ))}
      {stages.length === 0 && <p className="text-sm text-muted-foreground px-2 italic">Κανένα στάδιο σε αυτή τη στήλη.</p>}
    </div>
  </div>
);

export function InterventionPipeline({ stages, project, allProjectInterventions, interventionName, contacts, owner, interventionMasterId }: InterventionPipelineProps) {
  const pendingItems = stages.filter((s) => s.status === 'Not Started');
  const inProgressItems = stages.filter((s) => s.status === 'In Progress' || s.status === 'Delayed');
  const completedItems = stages.filter((s) => s.status === 'Completed');
  const failedItems = stages.filter((s) => s.status === 'Failed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PipelineColumn title="Σε Εκκρεμότητα" stages={pendingItems} project={project} allProjectInterventions={allProjectInterventions} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId} />
      <PipelineColumn title="Σε Εξέλιξη" stages={inProgressItems} project={project} allProjectInterventions={allProjectInterventions} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
      <PipelineColumn title="Ολοκληρωμένα" stages={completedItems} project={project} allProjectInterventions={allProjectInterventions} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
      <PipelineColumn title="Απέτυχαν" stages={failedItems} project={project} allProjectInterventions={allProjectInterventions} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
    </div>
  );
}
