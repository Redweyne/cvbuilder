const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('cvforge_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('cvforge_token', token);
    } else {
      localStorage.removeItem('cvforge_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      this.setToken(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return response.blob();
    }

    return response.json();
  }

  auth = {
    register: async (email, password, fullName) => {
      const result = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      this.setToken(result.token);
      return result;
    },

    login: async (email, password) => {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      this.setToken(result.token);
      return result;
    },

    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.setToken(null);
      }
    },

    me: async () => {
      return this.request('/auth/me');
    },
  };

  cvs = {
    list: async () => {
      return this.request('/cvs');
    },

    get: async (id) => {
      return this.request(`/cvs/${id}`);
    },

    create: async (data) => {
      return this.request('/cvs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id, data) => {
      return this.request(`/cvs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id) => {
      return this.request(`/cvs/${id}`, { method: 'DELETE' });
    },
  };

  jobs = {
    list: async () => {
      return this.request('/jobs');
    },

    get: async (id) => {
      return this.request(`/jobs/${id}`);
    },

    create: async (data) => {
      return this.request('/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id, data) => {
      return this.request(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id) => {
      return this.request(`/jobs/${id}`, { method: 'DELETE' });
    },
  };

  templates = {
    list: async () => {
      return this.request('/templates');
    },
  };

  subscription = {
    get: async () => {
      return this.request('/subscription');
    },
  };

  coverLetters = {
    list: async () => {
      return this.request('/cover-letters');
    },

    create: async (data) => {
      return this.request('/cover-letters', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id, data) => {
      return this.request(`/cover-letters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id) => {
      return this.request(`/cover-letters/${id}`, { method: 'DELETE' });
    },
  };

  ai = {
    enhanceCV: async (cvData) => {
      return this.request('/ai/enhance-cv', {
        method: 'POST',
        body: JSON.stringify({ cvData }),
      });
    },

    analyzeJob: async (description) => {
      return this.request('/ai/analyze-job', {
        method: 'POST',
        body: JSON.stringify({ description }),
      });
    },

    tailorCV: async (cvData, jobData) => {
      return this.request('/ai/tailor-cv', {
        method: 'POST',
        body: JSON.stringify({ cvData, jobData }),
      });
    },

    generateCoverLetter: async (cvData, jobData, tone = 'professional') => {
      return this.request('/ai/cover-letter', {
        method: 'POST',
        body: JSON.stringify({ cvData, jobData, tone }),
      });
    },

    getATSScore: async (cvData) => {
      return this.request('/ai/ats-score', {
        method: 'POST',
        body: JSON.stringify({ cvData }),
      });
    },

    discoverStory: async (responses) => {
      return this.request('/ai/discover-story', {
        method: 'POST',
        body: JSON.stringify({ responses }),
      });
    },

    mockInterview: async (cvData, jobData, userAnswer, questionIndex) => {
      return this.request('/ai/mock-interview', {
        method: 'POST',
        body: JSON.stringify({ cvData, jobData, userAnswer, questionIndex }),
      });
    },

    interviewSummary: async (cvData, jobData, interviewHistory) => {
      return this.request('/ai/interview-summary', {
        method: 'POST',
        body: JSON.stringify({ cvData, jobData, interviewHistory }),
      });
    },

    mentorChat: async (message, context, conversationHistory = []) => {
      return this.request('/ai/mentor-chat', {
        method: 'POST',
        body: JSON.stringify({ message, context, conversationHistory }),
      });
    },

    applicationReadiness: async (cvData, jobData) => {
      return this.request('/ai/application-readiness', {
        method: 'POST',
        body: JSON.stringify({ cvData, jobData }),
      });
    },

    successRoadmap: async (userData, goals) => {
      return this.request('/ai/success-roadmap', {
        method: 'POST',
        body: JSON.stringify({ userData, goals }),
      });
    },

    parseCV: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const headers = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${API_BASE}/ai/parse-cv`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Failed to parse CV');
      }
      
      return response.json();
    },
  };

  export = {
    cvPdf: async (cvData, templateId) => {
      const blob = await this.request('/export/cv-pdf', {
        method: 'POST',
        body: JSON.stringify({ cvData, templateId }),
      });
      return blob;
    },

    coverLetterPdf: async (content, applicantName) => {
      const blob = await this.request('/export/cover-letter-pdf', {
        method: 'POST',
        body: JSON.stringify({ content, applicantName }),
      });
      return blob;
    },
  };
}

export const api = new ApiClient();
