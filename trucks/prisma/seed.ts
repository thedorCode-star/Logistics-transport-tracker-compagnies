import { PrismaClient } from '@prisma/client'
import { companies } from '../src/data/companies'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const data = companies.map(company => ({
    name: company.name,
    category: company.category,
    description: company.description,
    address: company.address,
    phone: company.phone,
    email: company.email,
    website: company.website,
    complianceCertified: company.complianceCertified || false,
  }));

  await prisma.company.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })