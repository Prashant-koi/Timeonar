using Timeonar.Api.Services;
using DotNetEnv; // Add this NuGet package

// Load environment variables from .env file
try
{
    DotNetEnv.Env.Load();
    Console.WriteLine("Environment variables loaded from .env file");
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Failed to load .env file: {ex.Message}");
    // Continue execution even if .env file is not found
}

var builder = WebApplication.CreateBuilder(args);

// Add configuration from environment variables
builder.Configuration.AddEnvironmentVariables();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enable CORS with Vercel domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",   // Local development
                "https://timeonar.vercel.app"  // Production Vercel app
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Register the Perplexity client
builder.Services.AddScoped<PerplexityClient>();
// Register the Progressive Timeline service
builder.Services.AddScoped<ProgressiveTimelineService>();

var app = builder.Build();

// Add logging at startup for debugging environment variables
var logger = app.Services.GetRequiredService<ILogger<Program>>();
var config = app.Services.GetRequiredService<IConfiguration>();

logger.LogInformation("Application starting...");
logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
logger.LogInformation("SonarApi:ApiKey configured: {IsConfigured}", 
    !string.IsNullOrEmpty(config["SonarApi:ApiKey"]));
logger.LogInformation("ALLOWED_ORIGINS configured: {IsConfigured}",
    !string.IsNullOrEmpty(config["ALLOWED_ORIGINS"]));

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// basic health checkpoint
app.MapGet("/health", () => "Healthy");

app.Run();