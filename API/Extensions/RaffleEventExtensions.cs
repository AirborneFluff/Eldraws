using API.Entities;

namespace API.Extensions;

public static class RaffleEventExtensions
{
    public static int GetHighTicket(this RaffleEvent raffle, int donation, int lowTicket)
    {
        var requiredTickets = (int) Math.Floor((decimal) donation / raffle.EntryCost);
        if (requiredTickets == 0) return 0;

        return lowTicket + requiredTickets - 1;
    }
}