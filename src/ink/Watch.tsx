import React, { FC } from "react";

import { CliArgs } from "../types.js";
import { Text } from "ink";

export const Watch: FC<CliArgs> = (args) => {
  return <Text>{JSON.stringify(args, null, 4)}</Text>;
};
