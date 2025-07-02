import { Effect, sample } from "effector";
import { Gate } from "effector-react";
import { getNewsFx, loadOneNews, loadOneNewsFx, MainPageGate } from ".";
import { $currentNews } from "./state";

const goodsSampleInstance = (effect: Effect<void, [], Error>, gate: Gate<unknown>) =>
  // необходимо для первого рендера
  sample({
    clock: gate.open,
    target: effect,
  });

goodsSampleInstance(getNewsFx, MainPageGate);

sample({
  clock: loadOneNews,
  source: $currentNews,
  fn: (_, data) => data,
  target: loadOneNewsFx,
});
