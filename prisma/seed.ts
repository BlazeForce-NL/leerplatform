import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Platform admin
  const admin = await db.user.upsert({
    where: { email: "admin@leerplatform.nl" },
    update: {},
    create: {
      email: "admin@leerplatform.nl",
      name: "Platform Admin",
      role: "PLATFORM_ADMIN",
    },
  });

  // Demo school
  const school = await db.school.upsert({
    where: { id: "seed-school-1" },
    update: {},
    create: {
      id: "seed-school-1",
      name: "Basisschool De Zon",
    },
  });

  // School admin
  const schoolAdmin = await db.user.upsert({
    where: { email: "beheerder@dezon.nl" },
    update: {},
    create: {
      email: "beheerder@dezon.nl",
      name: "Jan de Vries",
      role: "SCHOOL_ADMIN",
    },
  });
  await db.schoolAdmin.upsert({
    where: { schoolId_userId: { schoolId: school.id, userId: schoolAdmin.id } },
    update: {},
    create: { schoolId: school.id, userId: schoolAdmin.id },
  });

  // Leerkracht
  const teacher = await db.user.upsert({
    where: { email: "juf.lisa@dezon.nl" },
    update: {},
    create: {
      email: "juf.lisa@dezon.nl",
      name: "Lisa Bakker",
      role: "TEACHER",
    },
  });

  // Klas
  const klas = await db.class.upsert({
    where: { id: "seed-class-1" },
    update: { code: "GROEP4" },
    create: {
      id: "seed-class-1",
      name: "Groep 4A",
      code: "GROEP4",
      schoolId: school.id,
    },
  });
  await db.classTeacher.upsert({
    where: { classId_userId: { classId: klas.id, userId: teacher.id } },
    update: {},
    create: { classId: klas.id, userId: teacher.id },
  });

  // Twee leerlingen (geen e-mail nodig voor leerlingen)
  const leerlingen = [
    { id: "seed-student-1", name: "Emma" },
    { id: "seed-student-2", name: "Noah" },
  ];

  for (const l of leerlingen) {
    const leerling = await db.user.upsert({
      where: { id: l.id },
      update: {},
      create: { id: l.id, name: l.name, role: "STUDENT" },
    });
    await db.classMembership.upsert({
      where: { classId_userId: { classId: klas.id, userId: leerling.id } },
      update: {},
      create: { classId: klas.id, userId: leerling.id },
    });
  }

  console.log("Seed voltooid:", { admin: admin.email, school: school.name, klas: klas.name });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
