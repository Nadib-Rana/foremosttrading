import { PrismaClient } from "@/generated/client";
import { Redis } from "ioredis";
// import Stripe from "stripe";

import { EmailProvider } from "@/providers/EmailProvider";

export interface ServiceMap {
  prisma: PrismaClient;
  redis: Redis;
  email: EmailProvider;
}
