import { seedTransactions } from "../../../actions/Seed";

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}
