import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'gmts@hotmail.com.br'
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ORGANIZER' },
  })
  console.log('Promovendo Guilherme a ORGANIZER...')
  console.log('Sucesso!', updatedUser.name, 'agora é ORGANIZADOR.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
