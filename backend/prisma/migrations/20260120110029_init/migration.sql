-- CreateTable
CREATE TABLE "Feed" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenJob" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeenJob_pkey" PRIMARY KEY ("id")
);
