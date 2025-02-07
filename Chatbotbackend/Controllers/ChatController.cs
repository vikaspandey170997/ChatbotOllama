using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ChatController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest message)
    {
        // Define the URL for the POST request
        var url = "http://localhost:11434/api/chat";

        // Prepare the request payload
 //       var payload = 
 //new ChatRequest
 //       {
 //           Model = "llama3.2:1b",
 //           Messages = new List<Message>
 //               {
 //                   new Message { Role = "user", Content = "why sky is blue?" }
 //               },
 //           Stream = false
 //       };


        // Serialize the payload to JSON
        var jsonPayload = JsonSerializer.Serialize(message);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // Send the POST request
        var response = await _httpClient.PostAsync(url, content);

        // Check if the request was successful
        if (response.IsSuccessStatusCode)
        {
            // Read the response content
            var result = await response.Content.ReadAsStringAsync();
            return Ok(new { response = result });
        }

        // Handle errors
        return StatusCode((int)response.StatusCode, "Error communicating with Ollama");
    }
}

public class ChatRequest
{
    public string Model { get; set; }
    public List<Message> Messages { get; set; }
    public bool Stream { get; set; }
}

public class Message
{
    public string Role { get; set; }
    public string Content { get; set; }
}