"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const paths =
    pathname === "/" ? ["home"] : pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, i) => {
          const isLast = i === paths.length - 1;

          const href =
            path === "dashboard"
              ? "/dashboard/home"
              : "/" + paths.slice(0, i + 1).join("/");

          const isDisabledDashboard =
            path === "dashboard" && pathname === "/dashboard/home";

          return (
            <Fragment key={i}>
              <BreadcrumbItem className="capitalize font-semibold text-accent-foreground">
                {isLast || isDisabledDashboard ? (
                  <span>{path}</span>
                ) : (
                  <Link href={href}>{path}</Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
