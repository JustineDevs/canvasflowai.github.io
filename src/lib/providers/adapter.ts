import type { PromptSummary, Scene } from "@/lib/scene/types";
import type {
  CloudBridgeGenerateResponse,
  CloudBridgeStatusResponse,
  CloudProviderId,
} from "../../../shared/cloud-bridge-contract";

export interface GenerationAdapter {
  getStatus(): Promise<CloudBridgeStatusResponse>;
  generate(
    scene: Scene,
    promptSummary: PromptSummary,
    provider: CloudProviderId,
  ): Promise<CloudBridgeGenerateResponse>;
}
