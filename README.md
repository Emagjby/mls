# MLS Framework

A powerful, modular learning engine API with a demo UI. Build your own learning applications by integrating with our RESTful API endpoints.

## 🚀 What is MLS Framework?

MLS (Modular Learning System) is a **learning engine** that provides:

- **Course Management**: Create, update, and organize learning content
- **Progress Tracking**: Monitor user progress across courses and stages
- **Quiz System**: Interactive assessments with scoring and feedback
- **User Management**: Authentication and profile management
- **Flexible Architecture**: Use our API with any frontend framework

## 🎯 Demo vs. Production

This repository includes:

- ✅ **Complete API** with all endpoints
- ✅ **Demo UI** built with Next.js (for testing and reference)
- ✅ **Database Schema** ready for production
- ✅ **Authentication** with Supabase Auth
- ✅ **Documentation** for easy integration

**You can:**

- Use the demo UI to test the API
- Build your own UI using any framework (React, Vue, Angular, etc.)
- Deploy the API separately from your frontend
- Customize the learning experience for your specific needs

## 🛠️ Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/mls-framework.git
cd mls-framework
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

Run the database migrations:

```bash
npm run db:setup
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the demo UI.

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/user
```

### Course Management

```http
GET /api/courses
GET /api/courses/[id]
POST /api/courses
PUT /api/courses/[id]
DELETE /api/courses/[id]
```

### Learning Progress

```http
GET /api/progress/user/[userId]
POST /api/progress/update
GET /api/progress/course/[courseId]
```

### Quiz System

```http
GET /api/quizzes/[id]
POST /api/quizzes/submit
GET /api/quizzes/results/[id]
```

## 🔧 Integration Guide

### For React Developers

```javascript
// Example: Fetching courses
const fetchCourses = async () => {
  const response = await fetch("/api/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
```

### For Vue.js Developers

```javascript
// Example: Submitting quiz answers
const submitQuiz = async (quizId, answers) => {
  const response = await fetch(`/api/quizzes/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quizId, answers }),
  });
  return response.json();
};
```

### For Mobile Apps (React Native)

```javascript
// Example: Tracking progress
const updateProgress = async (stageId, completed) => {
  const response = await fetch("/api/progress/update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stageId, completed }),
  });
  return response.json();
};
```

## 🎨 Customizing the UI

### Option 1: Use the Demo UI as Starting Point

1. Fork this repository
2. Replace the UI components in `src/components/`
3. Customize the styling and layout
4. Keep the API integration intact

### Option 2: Build Your Own UI from Scratch

1. Use only the API endpoints
2. Build your UI with any framework
3. Follow the API documentation
4. Implement your own authentication flow

### Option 3: Use as Headless CMS

1. Deploy the API separately
2. Use it as a backend for multiple frontends
3. Create different UIs for different use cases

## 📊 Database Schema

The engine uses a flexible schema that supports:

- **Users**: Authentication and profiles
- **Courses**: Learning content organization
- **Stages**: Individual learning modules
- **Quizzes**: Assessment and testing
- **Progress**: User learning tracking
- **Results**: Quiz scores and analytics

## 🚀 Deployment

### API Deployment

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway up

# Deploy to Heroku
heroku create
git push heroku main
```

### Database Deployment

1. Set up Supabase project
2. Run migrations
3. Configure environment variables
4. Deploy API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 [Full API Documentation](./docs/API.md)
- 🎯 [Integration Examples](./docs/EXAMPLES.md)
- 🐛 [Report Issues](https://github.com/your-username/mls-framework/issues)
- 💬 [Discussions](https://github.com/your-username/mls-framework/discussions)

## 🎉 What's Next?

- [ ] Add more quiz types (multiple choice, fill-in-blank, etc.)
- [ ] Implement spaced repetition algorithms
- [ ] Add analytics and reporting
- [ ] Create mobile SDKs
- [ ] Build admin dashboard
- [ ] Add content management system

---

**Built with ❤️ for the learning community**
