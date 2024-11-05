using API.Data.DTOs;
using API.Data.Parameters;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<UserUpdateDto, AppUser>();
        CreateMap<AppUser, UserDto>();
        
        CreateMap<NewGuildDto, Guild>();
        CreateMap<Guild, GuildDto>()
            .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Memberships));

        CreateMap<GuildMembership, GuildMemberDto>()
            .ForMember(dest => dest.UserName, opt =>
                opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.Gamertag, opt =>
                opt.MapFrom(src => src.AppUser!.Gamertag))
            .ForMember(dest => dest.RoleName, opt =>
                opt.MapFrom(src => src.Role!.Name));

        CreateMap<GuildRole, GuildRoleDto>();

        CreateMap<GuildBlacklist, BlacklistedUserDto>();

        CreateMap<GuildApplication, GuildApplicationDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.AppUser!.Gamertag));

        CreateMap<NewEventDto, Event>();
        CreateMap<NewBingoEventDto, Event>();
        CreateMap<NewBingoEventDto, BingoEventParams>();
        CreateMap<Event, EventDto>();
        CreateMap<BingoEvent, BingoEventDto>();
        CreateMap<NewRaffleEventDto, Event>();
        CreateMap<NewRaffleEventDto, RaffleEventParams>();
        
        CreateMap<NewTileDto, Tile>();
        CreateMap<TileUpdateDto, Tile>();
        CreateMap<TileDto, Tile>();
        CreateMap<Tile, TileDto>();
        CreateMap<Tile, TilePeakDto>();

        CreateMap<BingoBoardTile, BingoBoardTileDto>();
        CreateMap<BingoBoardTile, BingoBoardTilePeakDto>();
        CreateMap<TileSubmission, TileSubmissionDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.AppUser!.Gamertag));
    }
}