import type { PointerEvent as ReactPointerEvent } from "react";

export interface PointLike {
  x: number;
  y: number;
}

export class Point implements PointLike {
  constructor(
    public x: number,
    public y: number,
  ) {}

  public distanceTo(point: PointLike): number {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  public static fromPointerEvent(
    event: ReactPointerEvent<HTMLElement>,
    dpi = 1,
  ): Point {
    const { top, bottom, left, right } = event.currentTarget.getBoundingClientRect();

    const x = (Math.min(Math.max(left, event.clientX), right) - left) * dpi;
    const y = (Math.min(Math.max(top, event.clientY), bottom) - top) * dpi;

    return new Point(x, y);
  }
}
