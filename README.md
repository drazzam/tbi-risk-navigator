# 🧠 TBI Risk Navigator

**Evidence-Based Clinical Decision Support for Traumatic Brain Injury Risk Assessment**

A sophisticated React web application for predicting clinically important traumatic brain injury (ciTBI) risk using validated prediction models and clinical decision rules.

[![Deploy Status](https://github.com/YOUR-USERNAME/tbi-risk-navigator/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR-USERNAME/tbi-risk-navigator/actions/workflows/deploy.yml)

## 🎯 Features

### Module 1: Intelligent Risk Assessment
- Interactive patient assessment with 9 clinical predictors
- Real-time risk calculation using validated Bayesian model
- Risk categorization with 95% confidence intervals
- Visual representation of predictor contributions
- Context-aware clinical recommendations

### Module 2: CDR Comparison Dashboard
- Side-by-side comparison of established Clinical Decision Rules (CCHR, NOC, NEXUS II, CHIP)
- Performance metrics (sensitivity, specificity, CT scan rates)
- Predictive model at multiple thresholds
- CDR disagreement detection and arbitration

### Module 3: Decision Consequence Analyzer
- Interactive threshold exploration (1-10% risk)
- Real-time consequence analysis per 1,000 patients
- Side-by-side comparison: Selective Scanning vs Scan All
- Adjustable cost parameters (CT cost, treatment cost, radiation)
- Economic impact visualization

## 📊 Research Foundation

This tool is based on:
- **Validation Cohort**: 15,000 patients from 9 studies (61,955 total patients)
- **Model Performance**: C-statistic 0.7724 (95% CI: 0.757-0.788)
- **Calibration**: Brier score 0.0364, O/E ratio 0.9702
- **Methodology**: Bayesian meta-analysis with bootstrap validation

⚠️ **Research & Development Only**: This tool is for research and development purposes only. NOT intended for use in clinical practice. For educational and validation purposes.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher)
- **Git**
- **GitHub account**

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/tbi-risk-navigator.git
   cd tbi-risk-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will hot-reload as you make changes

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. **Important**: Name it exactly `tbi-risk-navigator` (or update `vite.config.js` - see Configuration section)
3. Make it **Public** (required for GitHub Pages on free tier)
4. Don't initialize with README, .gitignore, or license (we have these already)

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TBI Risk Navigator"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/tbi-risk-navigator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar, under "Code and automation")
4. Under **Source**, select:
   - Source: **GitHub Actions**
   - (If you see "Branch" dropdown instead, the Actions workflow will handle deployment automatically)

### Step 4: Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Trigger on every push to `main` branch
- Install dependencies
- Build the application
- Deploy to GitHub Pages

**Wait 2-3 minutes** for the first deployment to complete.

### Step 5: Access Your Deployed App

Your app will be available at:
```
https://YOUR-USERNAME.github.io/tbi-risk-navigator/
```

🎉 **Done!** The app is now live with full CSS and animations working.

---

## ⚙️ Configuration

### Repository Name (Important!)

If you named your GitHub repository something other than `tbi-risk-navigator`, you must update the base URL:

**File: `vite.config.js`**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',  // ⬅️ UPDATE THIS
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update `base: '/'` in `vite.config.js`

---

## 🔧 Troubleshooting

### Issue: 404 Error on Deployed Site

**Cause**: Incorrect base URL in `vite.config.js`

**Solution**: 
- Ensure the `base` in `vite.config.js` matches your repository name
- Format: `base: '/repository-name/'` (with leading and trailing slashes)

### Issue: CSS/Styles Not Loading

**Cause**: Vite assets not being referenced correctly

**Solution**:
- Verify `base` URL is correct in `vite.config.js`
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for 404 errors on CSS files

### Issue: GitHub Actions Workflow Failing

**Cause**: Permissions not configured

**Solution**:
1. Go to **Settings** > **Actions** > **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Save and re-run the workflow

### Issue: App Works Locally but Not on GitHub Pages

**Cause**: Relative paths or environment-specific code

**Solution**:
- Test the production build locally: `npm run build && npm run preview`
- Check browser console for errors on the deployed site
- Ensure all imports use relative paths (no absolute paths)

---

## 🌐 Alternative Deployment Options

### Vercel (Recommended for Zero-Config)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. App will be live at `https://your-project.vercel.app`

**Benefits**: Automatic deployments, custom domains, environment variables, analytics

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow prompts
4. App will be live at `https://your-project.netlify.app`

**Benefits**: Form handling, serverless functions, split testing

### Docker (Self-Hosted)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📁 Project Structure

```
tbi-risk-navigator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── alert.jsx       # Alert component (shadcn/ui)
│   │       ├── card.jsx        # Card component (shadcn/ui)
│   │       └── tabs.jsx        # Tabs component (shadcn/ui)
│   ├── lib/
│   │   └── utils.js            # Utility functions (cn for className merging)
│   ├── App.jsx                 # Main TBI Risk Navigator component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind directives
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── README.md                   # This file
```

---

## 🛠️ Technology Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.3
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (customized)
- **Charts**: Recharts 2.12
- **Icons**: Lucide React 0.263
- **Deployment**: GitHub Actions + GitHub Pages

---

## 🎨 Customization

### Colors

Edit Tailwind colors in `tailwind.config.js` and CSS variables in `src/index.css`.

### Model Coefficients

Update coefficients in `src/App.jsx` in the `modelCoefficients` object (lines ~22-33).

**⚠️ Warning**: Only update coefficients if you have re-validated the model. Using incorrect coefficients will produce inaccurate risk predictions.

### Performance Metrics

Update threshold performance data in `src/App.jsx` in the `thresholdData` object (lines ~261-267).

---

## 📝 Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages (manual) |

---

## 🤝 Contributing

This is a research tool. If you'd like to contribute or suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is for research and educational purposes only. Not intended for clinical use.

**Research Foundation**: Based on systematic review and Bayesian meta-analysis of 9 studies (N=61,955 patients).

---

## ❓ Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [GitHub Actions logs](https://github.com/YOUR-USERNAME/tbi-risk-navigator/actions)
3. Check browser console for JavaScript errors
4. Verify all configuration in `vite.config.js`

---

## 🎓 Citation

If you use this tool in research or educational contexts, please cite the underlying research methodology and validation studies.

---

**Built with ❤️ for evidence-based medicine**
