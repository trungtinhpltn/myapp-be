import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const exist = await prisma.user.findFirst({
    where: {
      username: 'admin',
    },
  });
  if (!exist) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: await bcrypt.hash('123456789', 10),
        fullName: 'QTV',
        phoneNumber: '',
        role: 'ADMIN',
      },
    });
  }
  else{
    console.log("Existed")
  }
}
main().finally(() => prisma.$disconnect());
