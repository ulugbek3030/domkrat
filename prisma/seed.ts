import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcrypt"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@domkrat.uz" },
    update: { emailVerified: new Date() },
    create: {
      email: "admin@domkrat.uz",
      firstName: "Admin",
      lastName: "Domkrat",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })
  console.log("Admin user created: admin@domkrat.uz / admin123")

  // Categories
  const categories = [
    { name: "Фильтры", slug: "filtry", description: "Масляные, воздушные, салонные и топливные фильтры" },
    { name: "Тормозная система", slug: "tormoznaya-sistema", description: "Колодки, диски, суппорта" },
    { name: "Подвеска", slug: "podveska", description: "Амортизаторы, рычаги, сайлентблоки" },
    { name: "Масла и жидкости", slug: "masla-i-zhidkosti", description: "Моторные масла, антифризы, тормозные жидкости" },
    { name: "Электрика", slug: "elektrika", description: "Свечи, катушки, генераторы, стартеры" },
    { name: "Двигатель", slug: "dvigatel", description: "Ремни, ролики, прокладки, помпы" },
    { name: "Кузовные детали", slug: "kuzovnye-detali", description: "Зеркала, фары, бамперы" },
    { name: "Охлаждение", slug: "ohlazhdenie", description: "Радиаторы, термостаты, вентиляторы" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`${categories.length} categories created`)

  // Vehicle Makes & Models
  const vehicles = [
    {
      name: "Chevrolet", slug: "chevrolet", sortOrder: 1,
      models: [
        { name: "Cobalt", slug: "cobalt", years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Spark", slug: "spark", years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
        { name: "Lacetti", slug: "lacetti", years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013] },
        { name: "Malibu", slug: "malibu", years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021] },
        { name: "Tracker", slug: "tracker", years: [2019, 2020, 2021, 2022, 2023] },
        { name: "Onix", slug: "onix", years: [2020, 2021, 2022, 2023] },
      ],
    },
    {
      name: "Toyota", slug: "toyota", sortOrder: 2,
      models: [
        { name: "Camry", slug: "camry", years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Corolla", slug: "corolla", years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Land Cruiser", slug: "land-cruiser", years: [2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022] },
      ],
    },
    {
      name: "Hyundai", slug: "hyundai", sortOrder: 3,
      models: [
        { name: "Accent", slug: "accent", years: [2010, 2012, 2014, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Tucson", slug: "tucson", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Santa Fe", slug: "santa-fe", years: [2012, 2014, 2016, 2018, 2019, 2020, 2021, 2022] },
      ],
    },
    {
      name: "Kia", slug: "kia", sortOrder: 4,
      models: [
        { name: "K5", slug: "k5", years: [2020, 2021, 2022, 2023] },
        { name: "Sportage", slug: "sportage", years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
        { name: "Rio", slug: "rio", years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      ],
    },
    {
      name: "Daewoo", slug: "daewoo", sortOrder: 5,
      models: [
        { name: "Matiz", slug: "matiz", years: [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2015] },
        { name: "Nexia", slug: "nexia", years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] },
        { name: "Gentra", slug: "gentra", years: [2013, 2014, 2015, 2016] },
      ],
    },
  ]

  for (const make of vehicles) {
    const createdMake = await prisma.vehicleMake.upsert({
      where: { slug: make.slug },
      update: {},
      create: { name: make.name, slug: make.slug, sortOrder: make.sortOrder },
    })

    for (const model of make.models) {
      const createdModel = await prisma.vehicleModel.upsert({
        where: { makeId_slug: { makeId: createdMake.id, slug: model.slug } },
        update: {},
        create: { name: model.name, slug: model.slug, makeId: createdMake.id },
      })

      for (const year of model.years) {
        await prisma.vehicleYear.upsert({
          where: {
            modelId_year_engineType: {
              modelId: createdModel.id,
              year,
              engineType: "",
            },
          },
          update: {},
          create: { year, modelId: createdModel.id, engineType: "" },
        })
      }
    }
  }
  console.log(`${vehicles.length} vehicle makes with models seeded`)

  // Sample products
  const filtryCategory = await prisma.category.findUnique({ where: { slug: "filtry" } })
  const tormozkCategory = await prisma.category.findUnique({ where: { slug: "tormoznaya-sistema" } })
  const maslaCategory = await prisma.category.findUnique({ where: { slug: "masla-i-zhidkosti" } })

  if (filtryCategory && tormozkCategory && maslaCategory) {
    const products = [
      { name: "Масляный фильтр Bosch F026407023", slug: "maslyanyy-filtr-bosch-f026407023", sku: "BOS-F026407023", oemNumber: "F026407023", brandName: "Bosch", price: 45000, categoryId: filtryCategory.id, shortDesc: "Масляный фильтр для Chevrolet Cobalt/Lacetti", isFeatured: true },
      { name: "Воздушный фильтр Mann C2860", slug: "vozdushnyy-filtr-mann-c2860", sku: "MAN-C2860", oemNumber: "C2860", brandName: "Mann", price: 65000, categoryId: filtryCategory.id, shortDesc: "Воздушный фильтр для Toyota Camry" },
      { name: "Салонный фильтр Filtron K1223", slug: "salonnyy-filtr-filtron-k1223", sku: "FIL-K1223", oemNumber: "K1223", brandName: "Filtron", price: 35000, categoryId: filtryCategory.id, shortDesc: "Угольный салонный фильтр" },
      { name: "Тормозные колодки передние TRW GDB1550", slug: "tormoznye-kolodki-trw-gdb1550", sku: "TRW-GDB1550", oemNumber: "GDB1550", brandName: "TRW", price: 120000, categoryId: tormozkCategory.id, shortDesc: "Передние тормозные колодки", isFeatured: true },
      { name: "Тормозной диск передний Brembo 09.9078.11", slug: "tormoznoj-disk-brembo-09907811", sku: "BRE-09907811", oemNumber: "09.9078.11", brandName: "Brembo", price: 250000, categoryId: tormozkCategory.id, shortDesc: "Вентилируемый тормозной диск" },
      { name: "Моторное масло Castrol EDGE 5W-30 4L", slug: "motornoe-maslo-castrol-edge-5w30-4l", sku: "CAS-EDGE5W30-4L", brandName: "Castrol", price: 320000, categoryId: maslaCategory.id, shortDesc: "Синтетическое моторное масло", isFeatured: true },
      { name: "Антифриз Motul Inugel G13 5L", slug: "antifriz-motul-inugel-g13-5l", sku: "MOT-INUGEL-5L", brandName: "Motul", price: 180000, categoryId: maslaCategory.id, shortDesc: "Концентрат антифриза" },
      { name: "Тормозная жидкость DOT4 Bosch 1L", slug: "tormoznaya-zhidkost-dot4-bosch-1l", sku: "BOS-DOT4-1L", brandName: "Bosch", price: 55000, categoryId: maslaCategory.id, shortDesc: "Тормозная жидкость DOT4" },
    ]

    for (const prod of products) {
      const existing = await prisma.product.findUnique({ where: { sku: prod.sku } })
      if (!existing) {
        const created = await prisma.product.create({ data: prod })
        await prisma.inventory.create({
          data: { productId: created.id, quantity: Math.floor(Math.random() * 50) + 5 },
        })
      }
    }
    console.log(`${products.length} sample products created`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
