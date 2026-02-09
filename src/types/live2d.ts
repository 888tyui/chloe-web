/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pixi-live2d-display" {
  export class Live2DModel {
    static from(
      source: string | object,
      options?: Record<string, any>
    ): Promise<Live2DModel>;
    x: number;
    y: number;
    scale: { set: (x: number, y?: number) => void };
    anchor: { set: (x: number, y?: number) => void };
    width: number;
    height: number;
    internalModel: {
      coreModel: any;
      motionManager: any;
    };
    expression(name?: string): void;
    motion(group: string, index?: number): void;
    destroy(): void;
  }

  export const MotionPreloadStrategy: {
    NONE: string;
    IDLE: string;
    ALL: string;
  };
}

declare module "pixi-live2d-display/cubism4" {
  export { Live2DModel, MotionPreloadStrategy } from "pixi-live2d-display";
}

interface Window {
  PIXI: any;
}
