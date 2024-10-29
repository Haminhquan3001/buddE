import { auth } from '@clerk/nextjs/server';

import prismaDB from '@/lib/prismadb';

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
    const { userId } = auth();
    if (!userId) {
        return false;
    }

    const userSubscription = await prismaDB.userSubscription
        .findUnique({
            where: {
                userId
            },
            select: {
                stripeSubscriptionId: true,
                stripeCurrentPeriodEnd: true,
                stripeCustomerId: true,
                stripePriceId: true,
            },
        });

    if (!userSubscription) {
        return false;
    }
    // if user subscription end period is valid 
    const isValid = userSubscription.stripePriceId
        && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
}
