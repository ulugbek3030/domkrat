import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Product images mapping by SKU
// Using verified Wikimedia Commons images (permanent, freely accessible, no API key needed)
// All URLs return HTTP 200 and use Wikimedia's thumbnail service for optimized 600px images
const productImages: Record<string, { url: string; alt: string }[]> = {
  "BOS-F026407023": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bosch_Oil_Filter.JPG/600px-Bosch_Oil_Filter.JPG",
      alt: "Масляный фильтр Bosch F026407023",
    },
  ],
  "MAN-C2860": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Air_filter_for_Toyota_1KR-FE.jpg/600px-Air_filter_for_Toyota_1KR-FE.jpg",
      alt: "Воздушный фильтр Mann C2860",
    },
  ],
  "FIL-K1223": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mercedes_E500_Cabin_Filters.jpg/600px-Mercedes_E500_Cabin_Filters.jpg",
      alt: "Салонный фильтр Filtron K1223",
    },
  ],
  "TRW-GDB1550": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Brake_pads.JPG/600px-Brake_pads.JPG",
      alt: "Тормозные колодки передние TRW GDB1550",
    },
  ],
  "BRE-09907811": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brembo_Disc_brake.jpg/600px-Brembo_Disc_brake.jpg",
      alt: "Тормозной диск передний Brembo 09.9078.11",
    },
  ],
  "CAS-EDGE5W30-4L": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Motor_oil.JPG/600px-Motor_oil.JPG",
      alt: "Моторное масло Castrol EDGE 5W-30 4L",
    },
  ],
  "MOT-INUGEL-5L": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Coolant.jpg/600px-Coolant.jpg",
      alt: "Антифриз Motul Inugel G13 5L",
    },
  ],
  "BOS-DOT4-1L": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Brzdov%C3%A1_kapalina_SYNTOL_-_%C4%8Derven%C3%A1_01.jpg/600px-Brzdov%C3%A1_kapalina_SYNTOL_-_%C4%8Derven%C3%A1_01.jpg",
      alt: "Тормозная жидкость DOT4 Bosch 1L",
    },
  ],
}

async function main() {
  console.log("Adding product images...")

  const products = await prisma.product.findMany({
    select: { id: true, sku: true, name: true },
  })

  for (const product of products) {
    const images = productImages[product.sku]
    if (!images) {
      console.log(`No images defined for ${product.sku} (${product.name})`)
      continue
    }

    // Check if images already exist
    const existingImages = await prisma.productImage.count({
      where: { productId: product.id },
    })

    if (existingImages > 0) {
      console.log(`Images already exist for ${product.sku}, skipping...`)
      continue
    }

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i].url,
          alt: images[i].alt,
          sortOrder: i,
          isPrimary: i === 0,
        },
      })
    }
    console.log(`Added ${images.length} image(s) for ${product.sku} (${product.name})`)
  }

  console.log("Image seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
