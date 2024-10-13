using API.Data.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<NewGuildDto, Guild>();
        CreateMap<Guild, GuildDto>();

        CreateMap<GuildMembership, GuildMemberDto>()
            .ForMember(dest => dest.UserName, opt =>
                opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.RoleName, opt =>
                opt.MapFrom(src => src.Role!.Name));

        CreateMap<GuildBlacklist, BlacklistedUserDto>();

        CreateMap<GuildApplication, GuildApplicationDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName));

        CreateMap<NewEventDto, Event>();
        CreateMap<Event, EventDto>();
        
        CreateMap<NewTileDto, Tile>();
        CreateMap<TileDto, Tile>();
        CreateMap<Tile, TileDto>();
        CreateMap<Tile, TilePeakDto>();

        CreateMap<BingoBoardTile, BingoBoardTileDto>();
        CreateMap<BingoBoardTile, BingoBoardTilePeakDto>();
        CreateMap<TileSubmission, TileSubmissionDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName));
    }
}