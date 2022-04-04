-- CreateTable
CREATE TABLE "Bill" (
    "name" VARCHAR(255) NOT NULL,
    "site" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT NOT NULL DEFAULT E'monthly',
    "dueDate" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("name")
);
