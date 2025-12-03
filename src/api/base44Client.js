class EntityManager {
  constructor(entityName) {
    this.entityName = entityName;
    this.storage = this.loadFromStorage();
  }

  loadFromStorage() {
    const key = `base44_${this.entityName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    const key = `base44_${this.entityName}`;
    localStorage.setItem(key, JSON.stringify(this.storage));
  }

  async list(sort = '-created_date', limit = 100) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let items = [...this.storage];
    
    if (sort.startsWith('-')) {
      const field = sort.substring(1);
      items.sort((a, b) => (b[field] || 0) - (a[field] || 0));
    } else {
      items.sort((a, b) => (a[sort] || 0) - (b[sort] || 0));
    }
    
    return items.slice(0, limit);
  }

  async filter(criteria, sort = '-created_date', limit = 100) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let items = this.storage.filter(item => {
      return Object.entries(criteria).every(([key, value]) => item[key] === value);
    });
    
    if (sort.startsWith('-')) {
      const field = sort.substring(1);
      items.sort((a, b) => (b[field] || 0) - (a[field] || 0));
    }
    
    return items.slice(0, limit);
  }

  async get(id) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.storage.find(item => item.id === id);
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newItem = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    this.storage.push(newItem);
    this.saveToStorage();
    return newItem;
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.storage.findIndex(item => item.id === id);
    if (index !== -1) {
      this.storage[index] = {
        ...this.storage[index],
        ...data,
        updated_date: new Date().toISOString(),
      };
      this.saveToStorage();
      return this.storage[index];
    }
    throw new Error('Item not found');
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.storage.findIndex(item => item.id === id);
    if (index !== -1) {
      this.storage.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

class Base44Client {
  constructor() {
    this.entities = {
      CVDocument: new EntityManager('CVDocument'),
      JobOffer: new EntityManager('JobOffer'),
      Template: new EntityManager('Template'),
      UserSubscription: new EntityManager('UserSubscription'),
      CoverLetter: new EntityManager('CoverLetter'),
    };

    this.auth = {
      me: async () => {
        const user = localStorage.getItem('base44_user');
        if (!user) {
          throw new Error('Not authenticated');
        }
        return JSON.parse(user);
      },
      login: async (email, password) => {
        const user = {
          id: 'user_1',
          email,
          full_name: 'Demo User',
          created_date: new Date().toISOString(),
        };
        localStorage.setItem('base44_user', JSON.stringify(user));
        return user;
      },
      logout: () => {
        localStorage.removeItem('base44_user');
        window.location.href = '/';
      },
      redirectToLogin: () => {
        const demoUser = {
          id: 'user_demo',
          email: 'demo@cvforge.app',
          full_name: 'Demo User',
          created_date: new Date().toISOString(),
        };
        localStorage.setItem('base44_user', JSON.stringify(demoUser));
        window.location.reload();
      },
    };
  }
}

export const base44 = new Base44Client();
