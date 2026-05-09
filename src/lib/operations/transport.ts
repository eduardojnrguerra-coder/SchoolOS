import { demoData } from "@/demo-data";

export type RouteStatus = "Not started" | "In progress" | "Delayed" | "Completed";

export function getRouteLearners(routeId: string) {
  return demoData.learnerTransportStatuses
    .filter((status) => status.routeId === routeId)
    .map((status) => ({
      status,
      learner: demoData.learners.find((learner) => learner.id === status.learnerId),
      stop: demoData.transportStops.find((stop) => stop.id === status.stopId)
    }))
    .filter((row) => row.learner);
}

export function getRouteVehicle(routeId: string) {
  const route = demoData.transportRoutes.find((item) => item.id === routeId);
  return demoData.transportVehicles.find((vehicle) => vehicle.id === route?.vehicleId);
}

export function getRouteDriver(routeId: string) {
  const route = demoData.transportRoutes.find((item) => item.id === routeId);
  return demoData.drivers.find((driver) => driver.id === route?.driverId);
}

export function transportPreview(type: "picked up" | "dropped off" | "delayed", routeName: string) {
  if (type === "picked up") return `Your child has been picked up on ${routeName}.`;
  if (type === "dropped off") return `Your child has been dropped off from ${routeName}.`;
  return `${routeName} is delayed. We will update you as the route progresses.`;
}
