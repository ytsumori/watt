import prisma from "@/lib/prisma/client";

const main = async () => {
  if (prisma) {
    console.log("Seeding database...");
    // storage.buckets
    await prisma.$executeRaw`INSERT INTO storage.buckets (id, name, public) VALUES ('meals', 'meals', true) ON CONFLICT (id) DO NOTHING;`;
    await prisma.$executeRaw`INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-interiors', 'restaurant-interiors', true) ON CONFLICT (id) DO NOTHING;`;
    await prisma.$executeRaw`INSERT INTO storage.buckets (id, name, public) VALUES ('menus', 'menus', true) ON CONFLICT (id) DO NOTHING;`;
  }
};

main()
  .then(async () => await prisma?.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma?.$disconnect();
    process.exit(1);
  });
