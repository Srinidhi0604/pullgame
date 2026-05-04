# openPAPER 

> **Don't just read the paper. Compile it.**

openPAPER is an interactive, browser-based educational platform designed to bridge the gap between theoretical research and practical implementation. It allows machine learning engineers, researchers, and students to implement state-of-the-art models from scratch, line by line, directly in the browser.

## 🌟 Key Features

### 📚 Interactive Papers Browser
Explore a highly curated collection of foundational and cutting-edge research papers across multiple domains:
- **Machine Learning**: From foundational algorithms (Backprop, Cross-Entropy) to architectures like Transformers and optimizers like Adam.
- **Bio & Chemistry**: Dive into AlphaFold, ChemBERTa, Single-cell Transcriptomics (scVI), Molecular Graph generation, and CRISPR sequence matching.
- **Hardware & Electrical Engineering**: Explore circuit simulation (SPICE), digital logic (RISC-V, Chisel), and power systems modeling.

### 💻 In-Browser Coding Terminal
No local setup required. The platform features a built-in code editor (powered by Monaco) and a sandboxed Python execution environment (powered by Pyodide). 
- Write Python code seamlessly in the browser.
- Run built-in unit tests and evaluation metrics.
- Instant feedback loop for your implementations.

### 📈 Fundamentals & Progression Tracks
Prepare for roles in Machine Learning, AI Engineering, and Research. 
- **150 ML Fundamentals**: Step-by-step challenges mirroring standard ML interview questions.
- **Data Science Core**: Modules dedicated to mastering `NumPy` and `Pandas`.
- **Leaderboard & Progress**: Track your daily streaks, solve counts, and see how you stack up against the global community.

### 🔐 Full Authentication & User Profiles
Secure user accounts powered by JWT, bcrypt, and MongoDB. Track your solved tasks, view your submission history, and customize your profile.

---

## 🛠️ Technology Stack

openPAPER is built with a modern, high-performance web stack:
- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS + Inline styles (Minimalist, dark-mode, glassmorphism aesthetic)
- **Editor Integration**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Python Runtime**: [Pyodide](https://pyodide.org/) (WASM-based Python environment)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication**: JWT & bcryptjs

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) and `npm` installed. You will also need a MongoDB database (local or Atlas) to store user data.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Srinidhi0604/pullgame.git
cd pullgame
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the root of the project and provide your MongoDB connection string and JWT secret:
\`\`\`env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/openpaper
JWT_SECRET=your_super_secret_jwt_key
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

\`\`\`text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── api/              # Backend API routes (auth, progress, etc.)
│   ├── auth/             # Login and Signup pages
│   ├── fundamentals/     # Fundamentals theory & exercises module
│   ├── leaderboard/      # Global leaderboard page
│   ├── papers/           # Main papers browser and individual task pages
│   ├── pricing/          # Subscription pricing page
│   └── tracks/           # Interactive domain flowchart page
├── components/           # Reusable React components
│   ├── CodingTerminal.tsx  # Core Monaco + Pyodide execution environment
│   ├── PapersBrowser.tsx   # Paper filtering and grid UI
│   ├── Navbar.tsx          # Global navigation and authentication state
│   └── ...
├── data/                 # Static content and problem specifications
│   ├── domainPapers.ts     # Curated paper list for Bio, Chem, EE
│   ├── fundamentals*.ts    # Datasets for basic skills
│   └── papers.ts           # Core ML paper tasks and code skeletons
├── lib/                  # Utilities (MongoDB connection, auth helpers)
└── models/               # Mongoose database schemas (User, Progress)
\`\`\`

---

## 🎨 Design Philosophy

openPAPER adheres to a strict **minimalist, brutalist-inspired** design aesthetic. We prioritize readability, focus, and performance. The UI utilizes monochromatic grayscale tones with subtle, purpose-driven color accents (e.g., cyan for interaction, purple/green/blue for specific domains).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
If you would like to add a new paper or task, please refer to the structure in \`src/data/papers.ts\` and submit a pull request with the corresponding test cases and skeleton code.

---

## 📝 License

This project is intended for educational purposes.
