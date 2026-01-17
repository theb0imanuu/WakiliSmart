import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordSecretary = await bcrypt.hash('secretpassword', 10);
  const hashedPasswordAdvocate = await bcrypt.hash('advocatepassword', 10);

  const secretary = await prisma.user.upsert({
    where: { email: 'secretary@example.com' },
    update: {},
    create: {
      email: 'secretary@example.com',
      username: 'secretary',
      name: 'Secretary User',
      password_hash: hashedPasswordSecretary,
      role: 'SECRETARY',
    },
  });

  const advocate = await prisma.user.upsert({
    where: { email: 'advocate@example.com' },
    update: {},
    create: {
      email: 'advocate@example.com',
      username: 'advocate',
      name: 'Advocate User',
      password_hash: hashedPasswordAdvocate,
      role: 'ADVOCATE',
    },
  });

  console.log({ secretary, advocate });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });