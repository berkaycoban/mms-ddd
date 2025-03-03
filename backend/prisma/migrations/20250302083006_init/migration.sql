-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageRestriction" INTEGER NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "roomNumber" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_date_timeSlot_roomNumber_key" ON "sessions"("date", "timeSlot", "roomNumber");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
