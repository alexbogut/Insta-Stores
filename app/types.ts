export type User = {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  email        String    @unique
  password     String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  profile      Profile
  items        String    @default("[]")
  sentMessages Message[] @relation("SentMessages")
  Messages     Message[] @relation("RecievedMessages")
  code         String?
  access_token String?
  username     String    @default("")
}