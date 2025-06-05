-- CreateTable
CREATE TABLE "order_data" (
    "unique_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitation" INTEGER NOT NULL,
    "visitor" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "portion" INTEGER NOT NULL,
    "customerId" TEXT,
    "eventId" TEXT,
    

    CONSTRAINT "order_data_pkey" PRIMARY KEY ("unique_id")
);

-- CreateTable
CREATE TABLE "customer_details" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,

    CONSTRAINT "customer_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_details" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_location" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "event_building" TEXT NOT NULL,
    "event_category" TEXT NOT NULL,
    "event_time" TEXT NOT NULL,

    CONSTRAINT "event_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_table" (
    "id" TEXT NOT NULL,
    "section_name" TEXT NOT NULL,
    "section_note" TEXT NOT NULL,
    "section_price" INTEGER NOT NULL,
    "section_portion" INTEGER NOT NULL,
    "section_total_price" INTEGER NOT NULL,
    "order_id" TEXT,

    CONSTRAINT "section_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portion_table" (
    "id" TEXT NOT NULL,
    "portion_name" TEXT,
    "portion_note" TEXT,
    "portion_count" INTEGER,
    "portion_price" INTEGER,
    "portion_total_price" INTEGER,
    "section_id" TEXT,

    CONSTRAINT "portion_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_data_customerId_key" ON "order_data"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "order_data_eventId_key" ON "order_data"("eventId");

-- AddForeignKey
ALTER TABLE "order_data" ADD CONSTRAINT "order_data_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_data" ADD CONSTRAINT "order_data_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_table" ADD CONSTRAINT "section_table_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_data"("unique_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portion_table" ADD CONSTRAINT "portion_table_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

