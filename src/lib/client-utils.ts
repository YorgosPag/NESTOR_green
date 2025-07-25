'use client';

import type { Project } from "@/types";
import { isPast } from 'date-fns';

export function calculateClientProjectMetrics(project: Project, isClient: boolean): Project {
    if (!project) {
        return project;
    }

    let totalStages = 0;
    let completedStages = 0;
    let overdueStages = 0;

    project.interventions?.forEach(intervention => {
        if (intervention.stages) {
            totalStages += intervention.stages.length;
            intervention.stages.forEach(stage => {
                if (stage.status === 'Completed') {
                    completedStages++;
                } else if (stage.status !== 'Completed') {
                     if (isClient && stage.deadline && isPast(new Date(stage.deadline))) {
                        overdueStages++;
                    }
                }
            });
        }
    });

    const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
    
    let status: Project['status'] = project.status;
    if (status !== 'Quotation' && status !== 'Completed') {
        if (progress === 100 && totalStages > 0) {
            status = 'Completed';
        } else if (overdueStages > 0) {
            status = 'Delayed';
        } else {
            status = 'On Track';
        }
    }

    return {
        ...project,
        progress,
        status,
        alerts: overdueStages, 
    };
}
