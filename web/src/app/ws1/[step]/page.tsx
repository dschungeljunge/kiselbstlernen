import { redirect } from "next/navigation";
import { WORKSHOP1_STEPS } from "@/lib/workshop1";
import { WorkshopStepClient } from "@/components/ws1/WorkshopStepClient";

interface WorkshopStepPageProps {
  params: Promise<{ step: string }>;
}

export default async function WorkshopStepPage({ params }: WorkshopStepPageProps) {
  const { step } = await params;
  const stepNumber = Number(step);

  if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > WORKSHOP1_STEPS.length) {
    redirect("/ws1/1");
  }

  return <WorkshopStepClient stepNumber={stepNumber} />;
}

