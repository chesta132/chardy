/**
 * Renders the primary call-to-action for an error page.
 * Uses the project's Button primitive so hover / animation behaviour
 * stays consistent with the rest of the site.
 */

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ErrorActionProps {
  label: string;
  href: string;
}

export const ErrorAction = ({ label, href }: ErrorActionProps) => {
  return (
    <Link href={href} tabIndex={-1}>
      <Button>{label}</Button>
    </Link>
  );
};
