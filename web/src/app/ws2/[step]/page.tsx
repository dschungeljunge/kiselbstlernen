import { redirect } from "next/navigation";
import { WORKSHOP2_STEPS } from "@/lib/workshop2";
import { Workshop2StepClient } from "@/components/ws2/Workshop2StepClient";

interface Workshop2StepPageProps {
  params: Promise<{ step: string }>;
}

export default async function Workshop2StepPage({ params }: Workshop2StepPageProps) {
  const { step } = await params;
  const stepNumber = Number(step);

  if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > WORKSHOP2_STEPS.length) {
    redirect("/ws2/1");
  }

  return <Workshop2StepClient stepNumber={stepNumber} />;
}

