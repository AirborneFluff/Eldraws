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
            .ForMember(dest => dest.Email, opt =>
                opt.MapFrom(src => src.AppUser!.Email))
            .ForMember(dest => dest.RoleName, opt =>
                opt.MapFrom(src => src.Role!.Name));

        CreateMap<GuildApplication, GuildApplicationDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.AppUser!.Email))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser!.UserName));
    }
}