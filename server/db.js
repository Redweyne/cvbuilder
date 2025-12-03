import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const db = new Database('cvforge.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'local',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cv_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT DEFAULT 'Untitled CV',
    template_id TEXT DEFAULT 'professional',
    personal_info TEXT DEFAULT '{}',
    experiences TEXT DEFAULT '[]',
    education TEXT DEFAULT '[]',
    skills TEXT DEFAULT '[]',
    certifications TEXT DEFAULT '[]',
    languages TEXT DEFAULT '[]',
    projects TEXT DEFAULT '[]',
    customization TEXT DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    ats_score INTEGER,
    job_match_score INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS job_offers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT,
    location TEXT,
    description TEXT,
    requirements TEXT DEFAULT '[]',
    url TEXT,
    salary_range TEXT,
    status TEXT DEFAULT 'saved',
    applied_date TEXT,
    notes TEXT,
    match_analysis TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cover_letters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    cv_id TEXT,
    job_id TEXT,
    title TEXT,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cv_id) REFERENCES cv_documents(id),
    FOREIGN KEY (job_id) REFERENCES job_offers(id)
  );

  CREATE TABLE IF NOT EXISTS user_subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free',
    ai_credits_used INTEGER DEFAULT 0,
    ai_credits_limit INTEGER DEFAULT 5,
    exports_used INTEGER DEFAULT 0,
    exports_limit INTEGER DEFAULT 3,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    expires_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'professional',
    is_premium INTEGER DEFAULT 0,
    layout_config TEXT DEFAULT '{}',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const defaultTemplates = [
  { id: 'professional', name: 'Professional', description: 'Clean and corporate design', category: 'professional', is_premium: 0 },
  { id: 'modern', name: 'Modern', description: 'Contemporary layout with bold accents', category: 'creative', is_premium: 0 },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant', category: 'minimal', is_premium: 0 },
  { id: 'creative', name: 'Creative', description: 'Stand out with unique design', category: 'creative', is_premium: 1 },
  { id: 'executive', name: 'Executive', description: 'For senior professionals', category: 'professional', is_premium: 1 },
  { id: 'tech', name: 'Tech', description: 'Perfect for developers', category: 'tech', is_premium: 0 },
];

const insertTemplate = db.prepare(`
  INSERT OR IGNORE INTO templates (id, name, description, category, is_premium) 
  VALUES (?, ?, ?, ?, ?)
`);

defaultTemplates.forEach(t => {
  insertTemplate.run(t.id, t.name, t.description, t.category, t.is_premium);
});

export const users = {
  create: (email, password, fullName) => {
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name) 
      VALUES (?, ?, ?, ?)
    `).run(id, email, passwordHash, fullName);
    
    db.prepare(`
      INSERT INTO user_subscriptions (id, user_id) VALUES (?, ?)
    `).run(uuidv4(), id);
    
    return { id, email, full_name: fullName };
  },
  
  findByEmail: (email) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  
  findById: (id) => {
    return db.prepare('SELECT id, email, full_name, avatar_url, created_at FROM users WHERE id = ?').get(id);
  },
  
  validatePassword: (user, password) => {
    return bcrypt.compareSync(password, user.password_hash);
  },

  createFromProvider: (email, fullName, provider, avatarUrl = null) => {
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return { id: existing.id, email: existing.email, full_name: existing.full_name };
    }
    
    const id = uuidv4();
    db.prepare(`
      INSERT INTO users (id, email, full_name, provider, avatar_url) 
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, fullName, provider, avatarUrl);
    
    db.prepare(`
      INSERT INTO user_subscriptions (id, user_id) VALUES (?, ?)
    `).run(uuidv4(), id);
    
    return { id, email, full_name: fullName };
  }
};

export const cvDocuments = {
  create: (userId, data) => {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO cv_documents (id, user_id, title, template_id, personal_info, experiences, education, skills, certifications, languages, projects, customization, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId,
      data.title || 'Untitled CV',
      data.template_id || 'professional',
      JSON.stringify(data.personal_info || {}),
      JSON.stringify(data.experiences || []),
      JSON.stringify(data.education || []),
      JSON.stringify(data.skills || []),
      JSON.stringify(data.certifications || []),
      JSON.stringify(data.languages || []),
      JSON.stringify(data.projects || []),
      JSON.stringify(data.customization || {}),
      data.status || 'draft'
    );
    return cvDocuments.findById(id);
  },
  
  findById: (id) => {
    const row = db.prepare('SELECT * FROM cv_documents WHERE id = ?').get(id);
    if (!row) return null;
    return parseCV(row);
  },
  
  findByUserId: (userId) => {
    const rows = db.prepare('SELECT * FROM cv_documents WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
    return rows.map(parseCV);
  },
  
  update: (id, userId, data) => {
    const existing = db.prepare('SELECT * FROM cv_documents WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) return null;
    
    db.prepare(`
      UPDATE cv_documents 
      SET title = ?, template_id = ?, personal_info = ?, experiences = ?, education = ?, skills = ?, 
          certifications = ?, languages = ?, projects = ?, customization = ?, status = ?, 
          ats_score = ?, job_match_score = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(
      data.title || existing.title,
      data.template_id || existing.template_id,
      JSON.stringify(data.personal_info || JSON.parse(existing.personal_info)),
      JSON.stringify(data.experiences || JSON.parse(existing.experiences)),
      JSON.stringify(data.education || JSON.parse(existing.education)),
      JSON.stringify(data.skills || JSON.parse(existing.skills)),
      JSON.stringify(data.certifications || JSON.parse(existing.certifications)),
      JSON.stringify(data.languages || JSON.parse(existing.languages)),
      JSON.stringify(data.projects || JSON.parse(existing.projects)),
      JSON.stringify(data.customization || JSON.parse(existing.customization)),
      data.status || existing.status,
      data.ats_score || existing.ats_score,
      data.job_match_score || existing.job_match_score,
      id, userId
    );
    return cvDocuments.findById(id);
  },
  
  delete: (id, userId) => {
    const result = db.prepare('DELETE FROM cv_documents WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  }
};

export const jobOffers = {
  create: (userId, data) => {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO job_offers (id, user_id, title, company, location, description, requirements, url, salary_range, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId,
      data.title,
      data.company || '',
      data.location || '',
      data.description || '',
      JSON.stringify(data.requirements || []),
      data.url || '',
      data.salary_range || '',
      data.status || 'saved',
      data.notes || ''
    );
    return jobOffers.findById(id);
  },
  
  findById: (id) => {
    const row = db.prepare('SELECT * FROM job_offers WHERE id = ?').get(id);
    if (!row) return null;
    return parseJob(row);
  },
  
  findByUserId: (userId) => {
    const rows = db.prepare('SELECT * FROM job_offers WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return rows.map(parseJob);
  },
  
  update: (id, userId, data) => {
    const existing = db.prepare('SELECT * FROM job_offers WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) return null;
    
    db.prepare(`
      UPDATE job_offers 
      SET title = ?, company = ?, location = ?, description = ?, requirements = ?, url = ?, 
          salary_range = ?, status = ?, applied_date = ?, notes = ?, match_analysis = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(
      data.title || existing.title,
      data.company || existing.company,
      data.location || existing.location,
      data.description || existing.description,
      JSON.stringify(data.requirements || JSON.parse(existing.requirements || '[]')),
      data.url || existing.url,
      data.salary_range || existing.salary_range,
      data.status || existing.status,
      data.applied_date || existing.applied_date,
      data.notes || existing.notes,
      data.match_analysis ? JSON.stringify(data.match_analysis) : existing.match_analysis,
      id, userId
    );
    return jobOffers.findById(id);
  },
  
  delete: (id, userId) => {
    const result = db.prepare('DELETE FROM job_offers WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  }
};

export const subscriptions = {
  findByUserId: (userId) => {
    return db.prepare('SELECT * FROM user_subscriptions WHERE user_id = ?').get(userId);
  },
  
  update: (userId, data) => {
    db.prepare(`
      UPDATE user_subscriptions 
      SET plan = COALESCE(?, plan), ai_credits_used = COALESCE(?, ai_credits_used),
          ai_credits_limit = COALESCE(?, ai_credits_limit), exports_used = COALESCE(?, exports_used),
          exports_limit = COALESCE(?, exports_limit), updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(data.plan, data.ai_credits_used, data.ai_credits_limit, data.exports_used, data.exports_limit, userId);
    return subscriptions.findByUserId(userId);
  },
  
  incrementAICredits: (userId) => {
    db.prepare('UPDATE user_subscriptions SET ai_credits_used = ai_credits_used + 1 WHERE user_id = ?').run(userId);
  },
  
  incrementExports: (userId) => {
    db.prepare('UPDATE user_subscriptions SET exports_used = exports_used + 1 WHERE user_id = ?').run(userId);
  }
};

export const templates = {
  findAll: () => {
    return db.prepare('SELECT * FROM templates ORDER BY is_premium ASC, name ASC').all();
  },
  
  findById: (id) => {
    return db.prepare('SELECT * FROM templates WHERE id = ?').get(id);
  }
};

export const coverLetters = {
  create: (userId, data) => {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO cover_letters (id, user_id, cv_id, job_id, title, content) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, data.cv_id || null, data.job_id || null, data.title || 'Cover Letter', data.content || '');
    return coverLetters.findById(id);
  },
  
  findById: (id) => {
    return db.prepare('SELECT * FROM cover_letters WHERE id = ?').get(id);
  },
  
  findByUserId: (userId) => {
    return db.prepare('SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  },
  
  update: (id, userId, data) => {
    db.prepare(`
      UPDATE cover_letters SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(data.title, data.content, id, userId);
    return coverLetters.findById(id);
  },
  
  delete: (id, userId) => {
    const result = db.prepare('DELETE FROM cover_letters WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  }
};

function parseCV(row) {
  return {
    ...row,
    personal_info: JSON.parse(row.personal_info || '{}'),
    experiences: JSON.parse(row.experiences || '[]'),
    education: JSON.parse(row.education || '[]'),
    skills: JSON.parse(row.skills || '[]'),
    certifications: JSON.parse(row.certifications || '[]'),
    languages: JSON.parse(row.languages || '[]'),
    projects: JSON.parse(row.projects || '[]'),
    customization: JSON.parse(row.customization || '{}')
  };
}

function parseJob(row) {
  return {
    ...row,
    requirements: JSON.parse(row.requirements || '[]'),
    match_analysis: row.match_analysis ? JSON.parse(row.match_analysis) : null
  };
}

export default db;
