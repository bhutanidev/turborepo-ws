import { prismaClient } from "@workspace/db/client";
export default async function Home() {
  const user = await prismaClient.user.findFirst();
  return (
    <div>
      user:{user?.name}
      email:{user?.email}
      <br />
      <div>
        hi there
      </div>
    </div>
  );
}