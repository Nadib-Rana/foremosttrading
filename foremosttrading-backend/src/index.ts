// src/index.ts
import { IgnitorApp } from "./core/IgnitorApp";
import { AppLogger } from "./core/logging/logger";
import { config } from "./core/config";

// Providers (Infrastructure)
import { PrismaProvider } from "./providers/PrismaProvider";
import { prisma } from "./lib/prisma";
import { RedisProvider } from "./providers/RedisProvider";
import { redis } from "./lib/redis";
import { EmailProvider } from "./providers/EmailProvider";
import { AuthModule } from "./Modules/Auth/AuthModule";
import { CartModule } from "./Modules/Cart/CartModule";
import { ProductModule } from "./Modules/Product/ProductModule";
import { UploadModule } from "./Modules/Upload/UploadModule";

// Modules (Business Logic)

async function bootstrap() {
  try {
    AppLogger.info("🗹 Starting application bootstrap");

    // 1. Initialize the Ignitor Engine
    const app = new IgnitorApp();

    // 2. Register Infrastructure Providers
    AppLogger.info("⚙ Registering infrastructure...");
    app.getContext().registerProvider("prisma", new PrismaProvider(prisma));
    app.getContext().registerProvider("redis", new RedisProvider(redis));
    app.getContext().registerProvider("email", new EmailProvider());

    // 3. Register Application Modules
    AppLogger.info("⚙ Registering modules...");
    app.registerModule(new AuthModule());
    app.registerModule(new CartModule());
    app.registerModule(new ProductModule());
    app.registerModule(new UploadModule());
    AppLogger.info("✔ All modules registered successfully");

    // 4. Seed Default Admin
    AppLogger.info("⚙ Seeding default admin...");
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword) {
      const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (!existingAdmin) {
        const bcrypt = await import("bcrypt");
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
          data: {
            email: adminEmail,
            password: passwordHash,
            fullName: "Default Admin",
            phone: "0000000000",
            role: "ADMIN",
            status: "ACTIVE"
          }
        });
        AppLogger.info("✔ Default admin seeded successfully");
      } else {
        AppLogger.info("✔ Default admin already exists");
      }
    }

    // 5. Spark the server!
    await app.spark(config.server.port);

    AppLogger.info("✷ Ignitor sparked successfully");
  } catch (error) {
    // Centralized Bootstrap Error Handling
    AppLogger.error("⬤ Failed to initialize application:", {
      error: error instanceof Error ? error : new Error(String(error)),
      context: "application-bootstrap",
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Start the application
bootstrap().catch((err) => {
  AppLogger.error("❌ Unhandled bootstrap error:", { error: err });
  process.exit(1);
});
