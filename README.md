# 🧠 TBI Risk Navigator

**Evidence-Based Clinical Decision Support for Traumatic Brain Injury Risk Assessment**

A sophisticated React web application for predicting clinically important traumatic brain injury (ciTBI) risk using validated prediction models and clinical decision rules.

[![Deploy Status](https://github.com/drazzam/tbi-risk-navigator/actions/workflows/deploy.yml/badge.svg)](https://github.com/drazzam/tbi-risk-navigator/actions/workflows/deploy.yml)

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
- **Validation Cohort**: 15,000 patients (61,955 total patients)
- **Model Performance**: C-statistic 0.7724 (95% CI: 0.757-0.788)
- **Calibration**: Brier score 0.0364, O/E ratio 0.9702

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


**Built with ❤️ for evidence-based medicine**
