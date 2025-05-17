# Timeonar: Smart Literature Timeline Explorer

![Timeonar Logo](frontend/public/logo.png)

## 🌟 Perplexity Sonar API Integration

Timeonar leverages the power of **Perplexity's Sonar API** to create rich, interactive timelines of scientific research and discoveries across any field of study. Our application demonstrates the capabilities of the Sonar API through multiple integration points:

- **Reasoning-Based Timeline Generation**: We utilize the `sonar-reasoning` model to analyze and synthesize information about a topic's historical development, generating comprehensive timelines with key discoveries, methodologies, and field evolution patterns.

- **Progressive Enrichment**: Our backend makes sequential API calls to enrich the timeline data in layers, providing users with a dynamic experience as details are populated in real-time:
  1. Base timeline generation with core details (years, titles, discoveries)
  2. Methodology and theoretical paradigm enrichment
  3. Field evolution insights to understand how each discovery influenced subsequent research

- **Academic Source Verification**: We employ custom prompt engineering and JSON extraction techniques to retrieve accurate source information, including original publication venues, DOIs, authors, and citation metrics.

- **Think-Aloud Pattern Parsing**: Custom JSON extraction utilities handle Sonar's reasoning process, capturing concise structured data from detailed API responses which may include explanatory text.

## ⚙️ Project Overview

Timeonar is an interactive web application that visualizes the evolution of scientific knowledge on any topic. It transforms complex research histories into clear, chronological timelines, making it easy to understand how ideas and discoveries have progressed through time.

### Key Features

- **🔍 Topic Discovery**: Search any research topic and watch as Sonar API pulls comprehensive data from thousands of academic sources
- **⏳ Time Travel**: Jump to specific years to see the state of knowledge during that period
- **📊 Citation Impact Analysis**: See which papers had the most influence with built-in citation metrics
- **🧩 Key Insight Extraction**: AI-powered identification of the most important contributions from each discovery
- **🔄 Progressive Loading**: Real-time timeline construction with streaming updates as data is processed
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **📥 PDF Export**: One-click export of complete timelines with source information

### Technological Stack

- **Frontend**: React with TypeScript, Tailwind CSS, built with Vite
- **Backend**: .NET 8 Web API
- **API Integration**: Perplexity Sonar API with the sonar-reasoning model
- **Visualization**: Custom timeline visualization with HTML Canvas
- **Data Processing**: Custom JSON parsing and entity extraction

## 📚 Use Cases

Timeonar is designed to serve multiple research-focused audiences:

- **Academic Researchers**: Track the evolution of research in specific fields and identify gaps for new studies
- **Students & Educators**: Create visual learning aids for understanding the historical progression of scientific topics
- **Literature Reviews**: Generate comprehensive literature reviews in a fraction of the time normally required
- **Corporate R&D**: Stay on top of industry trends and technological developments
- **Personal Learning**: Explore topics of interest and develop deeper understanding through chronological context

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ for frontend
- .NET 8 SDK for backend
- Perplexity API key (for Sonar API access)

### Installation

#### Frontend

```bash
# Frontend
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend/Timeonar.Api
dotnet restore
dotnet run
```

---

### Environment Setup

Create a `.env` file in the backend directory with your Perplexity API key:

```env
SONARAPI__APIKEY=your_api_key_here
```

---

### 🌸 How It Works

1. **User searches** for a topic of interest  
2. **Backend sends a query** to Perplexity’s Sonar API to generate a baseline timeline  
3. **Timeline enrichment** happens through subsequent API calls for methodology, field evolution, and source information  
4. **Frontend renders** the timeline with smooth transitions between years  
5. **Server-sent events** provide real-time updates as the timeline is populated with additional details  

---

### 🗂️ Project Structure

```
Timeonar/
├── backend/                 # .NET API backend
│   └── Timeonar.Api/        # Main API project
│       ├── Controllers/     # API endpoints
│       ├── Models/          # Data models
│       └── Services/        # Core services including Perplexity integration
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   └── src/                 
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components
│       ├── utils/           # Helper functions
│       └── types/           # TypeScript type definitions
```

---

### 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

---

### 📝 License

This project is MIT licensed.

---

### 🙏 Acknowledgements

- Perplexity team for creating the powerful Sonar API  
- All contributors involved in the development of this project  
- The hackathon organizers for the opportunity to build this tool  

