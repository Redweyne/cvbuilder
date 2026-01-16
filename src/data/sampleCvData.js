const sampleCvData = {
  personal_info: {
    full_name: 'Redweyne Maktouf',
    title: 'Customer Relations & Technical Support Specialist',
    email: 'redweynemk@gmail.com',
    phone: '0769933280',
    location: '16 Rue du Clos Grille, Le Pellerin',
    linkedin: 'https://linkedin.com/in/example',
    summary:
      'Graduate in English with solid experience in customer relations, technical support, and administrative management. I excel in dynamic environments where listening, precision, and communication are key. Versatile, empathetic, and solution-oriented, I am skilled at diagnosing and efficiently resolving technical issues while ensuring a smooth and professional customer experience. My goal is to join a company where I can apply my skills in technical support, customer loyalty, and high-quality client service.',
  },
  experiences: [
    {
      job_title: 'Administrative Assistant',
      company: 'ERT Technologies (SFR)',
      location: 'France',
      start_date: '2025-01',
      end_date: '2025-09',
      is_current: false,
      description: '',
      bullet_points: [
        'Administrative processing of SFR technical files (telecom networks)',
        'Communication with technicians and clients to coordinate interventions',
        'Management of anomalies, creation, and closure of tickets',
        'Verification of reports and quotas. Support for planning',
      ],
      achievements: 'Developed precision and client service excellence in a demanding technical environment.',
    },
    {
      job_title: 'Customer Service & Management Assistant',
      company: 'La Poste',
      location: 'France',
      start_date: '2024-08',
      end_date: '2024-10',
      is_current: false,
      description: '',
      bullet_points: [
        'Project coordination and team management within the customer service department',
        'Handling incoming and outgoing calls; resolving complex customer requests',
        'Ticket tracking and customer file management',
        'Advanced use of Excel (formulas and reports)',
        'Strict compliance with deadlines and service quality',
      ],
      achievements: 'Enhanced customer communication and multi-task management skills.',
    },
    {
      job_title: 'Commercial & Technical Advisor BtoB/BtoC',
      company: 'ApSystems International',
      location: 'France',
      start_date: '2023-06',
      end_date: '2024-06',
      is_current: false,
      description: '',
      bullet_points: [
        'Technical consulting and support for business and consumer clients',
        'Product demonstrations and solution recommendations',
        'Building lasting client relationships through exceptional service',
      ],
      achievements: '',
    },
  ],
  education: [
    {
      degree: "Bachelor's Degree",
      field: 'English (LLCE)',
      institution: 'Faculty of Arts and Humanities',
      location: '',
      start_date: '2020-09',
      graduation_date: '2023-05',
      gpa: '',
      achievements: ['Graduated in May 2023'],
    },
  ],
  skills: [
    {
      category: 'Core Competencies',
      items: [
        'Mastery of office and IT tools',
        'Negotiation & customer retention',
        'Problem diagnosis and resolution',
        'Microsoft Office Suite',
        'Autonomy & precision',
      ],
    },
  ],
  languages: [
    { language: 'French', proficiency: 'Native' },
    { language: 'English', proficiency: 'Native' },
    { language: 'Arabic', proficiency: 'Advanced' },
    { language: 'Japanese', proficiency: 'Elementary' },
  ],
  certifications: [],
  projects: [],
  customization: {
    primary_color: '#1a1a2e',
    accent_color: '#6c63ff',
    font_family: "'Cormorant Garamond', Georgia, serif",
  },
};

export default sampleCvData;
