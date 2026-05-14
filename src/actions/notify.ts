"use server";

import { notifyError } from "@/services/notify";
import { createNectAction } from "nectic/actions";

export const notifyErrorAction = createNectAction().handle(notifyError);
