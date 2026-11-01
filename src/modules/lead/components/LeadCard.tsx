import { MailIcon, PhoneIcon } from "lucide-react";
import type { LeadResponse } from "@/src/api/routes/lead/leadModels";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getInitials } from "@/src/lib/format";
import { DeleteLeadDialog } from "./DeleteLeadDialog";
import { LeadDetailsSheet } from "./LeadDetailsSheet";
import { LeadFormDialog } from "./LeadFormDialog";

interface LeadCardProps {
  lead: LeadResponse;
}

export function LeadCard({ lead }: LeadCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="truncate">{lead.name}</CardTitle>
        </div>
        <CardAction className="flex">
          <LeadFormDialog lead={lead} />
          <DeleteLeadDialog lead={lead} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 space-y-1.5 text-muted-foreground">
        <ContactLine icon={MailIcon} value={lead.email} href={lead.email && `mailto:${lead.email}`} />
        <ContactLine icon={PhoneIcon} value={lead.phone} href={lead.phone && `tel:${lead.phone}`} />
      </CardContent>

      <CardFooter className="border-t bg-muted/50 py-3">
        <LeadDetailsSheet lead={lead} />
      </CardFooter>
    </Card>
  );
}

function ContactLine({
  icon: Icon,
  value,
  href,
}: {
  icon: typeof MailIcon;
  value: string | null;
  href: string | null;
}) {
  return (
    <p className="flex items-center gap-2">
      <Icon className="size-4 shrink-0" />
      {value && href ? (
        <a href={href} className="truncate hover:text-foreground hover:underline">
          {value}
        </a>
      ) : (
        <span className="italic">Não informado</span>
      )}
    </p>
  );
}

export function LeadCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-3">
        <Skeleton className="h-7 w-28" />
      </CardFooter>
    </Card>
  );
}
