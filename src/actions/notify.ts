"use server";

import { notifyError } from "@/services/notify";
import { createNectAction } from "nectify-js/actions";

export const notifyErrorAction = createNectAction().handle(notifyError);
