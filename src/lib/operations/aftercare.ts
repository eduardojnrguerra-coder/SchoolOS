import { demoData } from "@/demo-data";

export function getAuthorizedCollectors(learnerId: string) {
  return demoData.learnerGuardianLinks
    .filter((link) => link.learnerId === learnerId && link.pickupAuthorized)
    .map((link) => demoData.guardians.find((guardian) => guardian.id === link.guardianId))
    .filter(Boolean);
}

export function aftercarePickupPreview(learnerName: string, collectorName: string) {
  return `${learnerName} was checked out from aftercare with ${collectorName}.`;
}
