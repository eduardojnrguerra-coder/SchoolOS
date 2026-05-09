import { demoData as seedDemoData } from "@/demo-data/seed";
import { DemoDataBundle } from "@/types/domain";

let activeDataBundle: DemoDataBundle = seedDemoData;

export function getRuntimeDataBundle(): DemoDataBundle {
  return activeDataBundle;
}

export function setRuntimeDataBundle(bundle: DemoDataBundle) {
  activeDataBundle = bundle;
}

export function resetRuntimeDataBundle() {
  activeDataBundle = seedDemoData;
}

export const runtimeDataBundle = new Proxy({} as DemoDataBundle, {
  get(_target, property: keyof DemoDataBundle) {
    return activeDataBundle[property];
  }
});
