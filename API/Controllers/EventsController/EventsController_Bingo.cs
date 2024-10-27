using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController
{
    private readonly string _evidenceBlobContainer = 
        config.GetSection("Azure")["EvidenceBlobContainer"] ?? throw new Exception("Azure blob storage not configured");
    
    [HttpPut("{eventId}/bingo")]
    [ValidateGuildEventRole("Owner, Admin")]
    public async Task<ActionResult> SetBingoTile([FromBody] UpdateBingoTileDto bingoTileDto, string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);

        var tile = await unitOfWork.TileRepository.GetTileById(bingoTileDto.TileId);
        if (tile is null) return NotFound("No tile found by that Id");

        var bingoTile = await unitOfWork.EventRepository.GetBingoBoardTileByPosition(bingoEvent.Id, bingoTileDto.TilePosition);

        if (bingoTile is not null)
        {
            bingoTile.TileId = bingoTileDto.TileId;
        }

        if (bingoTile is null)
        {
            bingoEvent.BoardTiles.Add(new BingoBoardTile
            {
                Id = Guid.NewGuid().ToString(),
                BingoEventId = bingoEvent.Id,
                TileId = bingoTileDto.TileId,
                Position = bingoTileDto.TilePosition
            });
        }

        if (await unitOfWork.Complete()) return Ok(mapper.Map<BingoBoardTileDto>(bingoTile));
        return BadRequest();
    }

    [HttpGet("{eventId}/bingo")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetBingoTiles(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        var tiles = await unitOfWork.EventRepository.GetBingoBoardTiles(bingoEvent.Id);
        return Ok(mapper.Map<List<BingoBoardTileDto>>(tiles));
    }

    [HttpGet("{eventId}/bingo/peak")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetBingoTilesPeak(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        var tiles = await unitOfWork.EventRepository.GetBingoBoardTiles(bingoEvent.Id);
        return Ok(mapper.Map<List<BingoBoardTilePeakDto>>(tiles));
    }

    [HttpPost("{eventId}/bingo/{bingoTileId}/submit")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> SubmitTile(string eventId, string bingoTileId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        var bingoTile = bingoEvent.BoardTiles.FirstOrDefault(t => t.Id == bingoTileId);
        if (bingoTile is null) return NotFound("No tile found by that Id");

        if (bingoTile.Submissions.Any(t => t.AppUserId == User.GetUserId() && t.JudgeId == null))
            return BadRequest("You've already submitted this tile");

        var submissionId = Guid.NewGuid().ToString();
        var files = Request.Form.Files;
        
        for (var i = 0; i < files.Count; i++)
        {
            var file = files[i];
            if (file.Length > FileService.MAX_FILE_SIZE) continue;
            
            var mimeType = file.ContentType;
            var fileName = $"{submissionId}_{i}";
            await fileService.UploadFileAsync(file.OpenReadStream(), fileName, mimeType, _evidenceBlobContainer);
        }

        var submission = new TileSubmission
        {
            Id = submissionId,
            AppUserId = User.GetUserId(),
            BingoBoardTileId = bingoTileId
        };
        
        bingoTile.Submissions.Add(submission);
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }

    [HttpPut("{eventId}/bingo/submissions/{submissionId}")]
    [ValidateGuildEventRole("Owner, Admin, Moderator")]
    public async Task<ActionResult> SubmissionResponse(string eventId, string submissionId,
        [FromBody] TileSubmissionResponseDto responseDto)
    {
        var submission = await unitOfWork.EventRepository.GetBingoTileSubmissionById(submissionId);
        if (submission is null) return NotFound("No submission found by that Id");

        submission.JudgeId = User.GetUserId();
        submission.Accepted = responseDto.Accepted;
        submission.Notes = responseDto.Notes;
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }

    [HttpGet("{eventId}/bingo/submissions/{submissionId}")]
    [ValidateGuildEventRole("Owner, Admin, Moderator")]
    public async Task<ActionResult> GetSubmissionEvidence(string eventId, string submissionId)
    {
        var containerClient = fileService.Client.GetBlobContainerClient(_evidenceBlobContainer);
        var blobs = await fileService.GetFilesAsync(_evidenceBlobContainer, blob => blob.Name.StartsWith(submissionId));
        var files = blobs.Select(blobItem => new BlobDto
        {
            Url = $"{containerClient.Uri}/{blobItem.Name}",
            ContentType = blobItem.Properties.ContentType
        });
        
        return Ok(files);
    }
}