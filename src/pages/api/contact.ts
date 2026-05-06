import { ContactController } from "@/controllers/contact";
import { Route } from "@/libs/route";
import { ContactPayload } from "@/payloads/contact";

export default new Route(
  {
    POST: ContactController.sendMessage,
  },
  { POST: { validator: ContactPayload.sendMessage } },
).toPagesRouter();
