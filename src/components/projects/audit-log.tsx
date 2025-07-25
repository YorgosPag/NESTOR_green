"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuditLog as AuditLogType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditLogDisplayProps {
  auditLogs: AuditLogType[];
}

export function AuditLogDisplay({ auditLogs }: AuditLogDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Δεν υπάρχει ακόμη ιστορικό ενεργειών για αυτό το έργο.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Χρήστης</TableHead>
          <TableHead>Ενέργεια</TableHead>
          <TableHead>Λεπτομέρειες</TableHead>
          <TableHead className="text-right">Ημερομηνία</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {log.user.avatar && (
                     <AvatarImage src={log.user.avatar} alt={log.user.name} data-ai-hint="person" />
                  )}
                  <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{log.user.name}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{log.action}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {log.details || "Δ/Υ"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {isClient
                ? format(new Date(log.timestamp), "dd MMM, yyyy, HH:mm")
                : "..."}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}