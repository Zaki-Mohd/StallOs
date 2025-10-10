# StallOS: The AI-Powered Operating System for Street Food Vendors

An AI-powered platform designed to help street food vendors optimize their daily operations, from recipe adjustments to profit maximization.

## About the Project

StallOS is a comprehensive toolkit for street food vendors, leveraging AI to tackle common challenges like ingredient variability, waste management, and dynamic pricing. The application provides actionable insights and intelligent assistants to help vendors run their business more efficiently and profitably.

### Key Features:

*   **AI Sous-Chef:** Get real-time cooking advice to maintain taste consistency despite variations in ingredients. Describe your ingredients via text or voice and get instant suggestions.
*   **Profit Optimizer:** Input daily ingredient prices and sales data to dynamically calculate costs and profits. Receive AI-powered recommendations on which menu items to promote.
*   **Performance Analytics:** Visualize your business performance with dynamic charts showing profit distribution, sales volume vs. profit margin, and daily revenue/profit totals.
*   **Zero-Waste Genius:** Turn leftover ingredients into new, sellable menu items. Describe your leftovers and get a creative, marketable recipe in seconds.
*   **Chaat-GPT Voice Assistant:** An interactive voice-powered assistant that can help with recipe adjustments, profit optimization, and waste reduction strategies through a natural conversation.
*   **Daily Sales Strategy:** Input your tiffin item data (costs, sales, profit) to receive a custom, AI-generated sales and marketing strategy for the day.

The goal of StallOS is to empower small food businesses with the advanced tools and data insights typically available only to large restaurants.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/stall-os.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd stall-os
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**

    This project requires API keys for Google Gemini and Vapi AI. You will need to add these directly into the source code.

    *   **Google Gemini API Key**: Open the `src/App.tsx` file. Find the components `AIChef`, `ZeroWaste`, and `DailyStrategy`. In each, locate the `apiKey` variable and replace `"AIzaSyASxHWMU-e4sweZohMia3iVN3vefSRh0l8"` with your actual Gemini API key.
    *   **Vapi AI Public Key**: In `src/App.tsx`, find the `ChaatGPT` component. Locate the line `const vapiInstance = new Vapi(...)` and replace `'59992990-1840-4767-adf9-4fd44bda821e'` with your Vapi public key.

5. **Configure Supabase Authentication**

This project now supports **user authentication** using [Supabase](https://supabase.com).  
Follow these steps to configure your own Supabase project:

#### Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and log in or sign up.  
2. Click **New Project**, enter a project name, and create it.  
3. Open your project dashboard.

#### Step 2: Enable Authentication Providers
1. Navigate to **Authentication → Providers**.  
2. Enable **Email/Password** sign-in.  
3. (Optional) To enable Google or GitHub login:
   - Toggle the provider **ON**.  
   - Add your **Client ID** and **Client Secret** from Google Cloud Console and GitHub Developer Settings.  
   - Set the redirect URL to:  
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     Replace `<your-project-ref>` with your Supabase project reference ID.

#### Step 3: Add Environment Variables
Create a `.env` file in the project root and add:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
Find these values under Project **Settings → API** in Supabase.

#### Step 4: Connect the Frontend
The Supabase client is defined in **src/utils/supabaseClient.ts**:

### Running the Application

Once you have completed the setup steps, you can run the application with the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Tech Stack

This project is built with the following technologies:

-   **Framework:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charts:** [Chart.js](https://www.chartjs.org/)
-   **AI Services:**
    -   [Google Gemini](https://ai.google.dev/)
    -   [Vapi AI](https://vapi.ai/) (for voice)
-   **UI Icons:** [Lucide React](https://lucide.dev/)

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License.
