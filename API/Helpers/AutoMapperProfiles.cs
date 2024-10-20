﻿using API.Data.DTOs;
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
        CreateMap<Guild, GuildDto>();

        CreateMap<GuildMembership, GuildMemberDto>()
            .ForMember(dest => dest.UserName, opt =>
                opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.Gamertag, opt =>
                opt.MapFrom(src => src.AppUser!.Gamertag))
            .ForMember(dest => dest.RoleName, opt =>
                opt.MapFrom(src => src.Role!.Name));

        CreateMap<GuildBlacklist, BlacklistedUserDto>();

        CreateMap<GuildApplication, GuildApplicationDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName))
            .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.AppUser!.Gamertag));

        CreateMap<NewEventDto, Event>();
        CreateMap<Event, EventDto>();
        
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