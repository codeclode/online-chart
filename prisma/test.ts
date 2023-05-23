import { PrismaClient, ColorPreSet } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.create({
  //   data: {
  //     username: "李傲松",
  //     password: "rhy37iu5rh",
  //     preset: [
  //       {
  //         colors: ["66ccff", "123"],
  //         type: ChartType.PIE,
  //         tag: false,
  //       },
  //     ],
  //   },
  // });
  // await prisma.chart.create({
  //   data: {
  //     type: ChartType.BOX,
  //     authorId: "642fc40fb4be8201f71e96e8",
  //   },
  // });
  let users = await prisma.chart.findMany({
    include: { author: true },
  });
  console.dir(users, {
    depth: null,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
