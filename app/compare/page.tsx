import { CompanyCompare } from "@/components/company-compare";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";

export default function ComparePage() {
  return (
    <>
      <SiteHeader active="Compare" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Side-by-side research"
          title="Compare companies on what you still need to know."
          copy="Use the same questions for both companies. This view organizes evidence; it does not declare a winner."
        />
        <CompanyCompare />
      </main>
    </>
  );
}
