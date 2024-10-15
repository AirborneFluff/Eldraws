﻿namespace API.Data.DTOs;

public class UserDto
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Gamertag { get; set; }
}