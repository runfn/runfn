import {
    NextApiRequest,
    //NextApiResponse
} from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

interface ExternalAccount {
    provider: string;
    id: string;
}

export async function GET(
    req: NextApiRequest,
    //res: NextApiResponse
) {
    const { userId } = getAuth(req);

    if (!userId) {
        return Response.json({ error: "Unauthorized" })
    }

    try {
        const clerk = await clerkClient()
        const user = await clerk.users.getUser(userId);

        console.log(user.externalAccounts)

        const githubAccount = user.externalAccounts.find(
            (account) => account.provider === "oauth_github"
        ) as ExternalAccount | undefined;

        console.log(githubAccount)

        if (!githubAccount) {
            return Response.json({ error: "GitHub account not connected" })
        }

        return Response.json({
            message: "GitHub account connected.",
            accountId: githubAccount.id,
        })
    } catch (error) {
        console.error("Error fetching GitHub account:", error);
        return Response.json({ error: "Internal Server Error" })
    }
}
