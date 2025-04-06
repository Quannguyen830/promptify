"use client";

import { type BaseProps } from "~/constants/interfaces";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { usePathname } from "next/navigation";

const PageBreadcrumb: React.FC<BaseProps> = ({ className }) => {
  const path = usePathname();
  const pathArray = path.split("/").filter(Boolean);

  return (
    <Breadcrumb className={` ${className}`}>
      <BreadcrumbList>        
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {pathArray.map((path, index: number) => (
          <div className="flex flex-row items-center gap-1.5" key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={"/" + path}>{path}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default PageBreadcrumb;