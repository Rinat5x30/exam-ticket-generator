# Exam Ticket Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)
![React](https://img.shields.io/badge/React-19+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

A powerful web application for generating random exam tickets with support for multiple subjects and difficulty levels.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Structure](#-project-structure)

</div>

---

## 📋 Description

**Exam Ticket Generator** is a modern web application that enables educators and administrators to create and manage a bank of exam questions and automatically generate randomized exam tickets for students.

The application provides:
- 🎯 Fast ticket generation across multiple subjects
- 📚 Management of large question banks
- 🔄 Support for different question organization methods (theory/practice or difficulty levels)
- 💾 Local data storage (IndexedDB)
- 🎨 Intuitive and responsive user interface

---

## ✨ Features

### Core Capabilities

- **Ticket Generation** — random selection of questions from the bank while maintaining subject structure
- **Question Management** — add, edit, and delete questions
- **Bulk Import** — quickly add large quantities of questions (paste from clipboard)
- **Multi-Subject Support** — support for various disciplines with their specific requirements
- **Export** — save tickets in convenient formats
- **Local Storage** — all data stored in the browser (privacy-focused)

### Special Features

#### 📐 Support for Different Subject Structures

- **Standard Subjects** (Mathematics, Literature, etc.):
  - Questions divided into **Theory** and **Practice**
  - Tickets contain random questions from both categories

- **Physics** (Special Mode):
  - Questions organized by **5 difficulty levels** (1-5)
  - Tickets contain exactly **5 questions** (one from each level)
  - Ideal for differentiated assessment of knowledge

#### 🔒 Data Privacy

- All questions and tickets stored locally in the browser
- No data sent to external servers
- Backup and restore via JSON files

---

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/exam-ticket-generator.git
   cd exam-ticket-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

---

## 📖 Usage

### 1️⃣ Adding Questions

#### Method 1: Bulk Import

1. Go to the **"Manage Questions"** page
2. In the **"Bulk Import"** section:
   - Select a subject
   - Choose type (for standard subjects) or level (for physics)
   - Paste questions (one per line)
   - Click **"Add All"**

#### Method 2: Import from File

- Use a JSON file with pre-prepared questions
- Format compatible with `seed-questions.json`

### 2️⃣ Generate a Ticket

1. On the **main page**, select a subject
2. Click **"Generate"**
3. The system will create a random ticket with questions
4. View, edit, or regenerate as needed

### 3️⃣ Export Results

- Use the **"Print"** function to output to printer
- Save results as PDF through your browser

---

## 🏗️ Project Structure

```
exam-ticket-generator/
├── app/                      # Next.js application
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Main layout
│   ├── page.tsx              # Home page
│   └── questions/
│       └── page.tsx          # Question management page
├── components/               # React components
│   ├── TicketGenerator.tsx   # Main generator component
│   ├── Ticket.tsx            # Ticket display
│   └── BulkImport.tsx        # Bulk import component
├── lib/                      # Utilities and logic
│   ├── generator.ts          # Ticket generation logic
│   ├── storage.ts            # Storage management (IndexedDB)
│   ├── types.ts              # TypeScript types and interfaces
│   └── validators.ts         # Data validation
├── public/                   # Static files
│   └── seed-questions.json   # Example questions
├── package.json              # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

### Key Files

| File | Description |
|------|-------------|
| [lib/generator.ts](lib/generator.ts) | Algorithm for question selection and ticket creation |
| [lib/storage.ts](lib/storage.ts) | Local storage management (IndexedDB) |
| [lib/types.ts](lib/types.ts) | Data type definitions (Question, Ticket, Subject) |
| [components/TicketGenerator.tsx](components/TicketGenerator.tsx) | Main application interface |

---

## 🛠️ Technology Stack

- **Frontend Framework:** Next.js 15 + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **Storage:** IndexedDB (browser storage)
- **Tools:** ESLint, PostCSS

---

## 📊 Supported Subjects

| Subject | Structure | Questions per Ticket |
|---------|-----------|----------------------|
| Mathematics | Theory + Practice | Variable |
| Physics | 5 difficulty levels | 5 (1 per level) |
| Literature | Theory + Practice | Variable |
| History | Theory + Practice | Variable |
| Chemistry | Theory + Practice | Variable |
| *Custom* | Theory + Practice | Variable |

---

## 🔄 Updates and Features

### v1.0.0 — Physics Support with Difficulty Levels

✅ Added support for special structure for "Physics" subject  
✅ Generation logic based on difficulty levels (1-5)  
✅ Integration with question system and storage  
✅ Enhanced interface for physics question management  

---

## 🤝 Contributing

We welcome improvements! Please:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

If you have questions or suggestions:

- 📧 Create an [Issue](../../issues)
- 💡 Propose improvements via Pull Request
- 📚 Check [documentation](#) for detailed information

---

<div align="center">

Made with ❤️ for educators

</div>

## Требования

Для генерации билета по физике необходимо:
- Минимум 1 вопрос для каждого уровня (всего 5 уровней)
- Если хотя бы для одного уровня нет вопросов, генерация будет невозможна

## Изменение количества уровней

Если нужно изменить количество уровней (например, сделать 10 вместо 5):
1. Откройте `types.ts`
2. Измените `export const PHYSICS_LEVELS = 5;` на нужное число
3. Все остальное будет работать автоматически

## Файлы для замены в проекте

### Папка `lib/`:
- `types.ts`
- `generator.ts`
- `storage.ts` (без изменений)

### Папка `components/`:
- `BulkImport.tsx`
- `Ticket.tsx`
- `TicketGenerator.tsx` (без изменений)

### Папка `app/`:
- `globals.css` (без изменений)
- `layout.tsx` (без изменений)
- `page.tsx` → `page-home.tsx` (без изменений)

### Папка `app/questions/`:
- `page.tsx` → `page-questions.tsx`

## Примеры вопросов для физики

**Уровень 1 (легкий):**
- Что такое сила?
- Определите понятие массы.

**Уровень 2:**
- Сформулируйте второй закон Ньютона.
- Что такое кинетическая энергия?

**Уровень 3 (средний):**
- Выведите формулу центростремительного ускорения.
- Объясните закон сохранения энергии.

**Уровень 4:**
- Решите задачу на движение тела под углом к горизонту.
- Рассчитайте момент инерции диска.

**Уровень 5 (сложный):**
- Докажите теорему Штейнера.
- Решите систему связанных тел на наклонной плоскости.
