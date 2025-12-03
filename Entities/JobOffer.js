{
  "name": "JobOffer",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Job title"
    },
    "company": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "job_type": {
      "type": "string",
      "enum": [
        "full-time",
        "part-time",
        "contract",
        "freelance",
        "internship"
      ]
    },
    "remote_type": {
      "type": "string",
      "enum": [
        "onsite",
        "remote",
        "hybrid"
      ]
    },
    "description": {
      "type": "string",
      "description": "Full job description text"
    },
    "requirements": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Extracted requirements"
    },
    "preferred_qualifications": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "required_skills": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "experience_level": {
      "type": "string",
      "enum": [
        "entry",
        "mid",
        "senior",
        "lead",
        "executive"
      ]
    },
    "salary_range": {
      "type": "object",
      "properties": {
        "min": {
          "type": "number"
        },
        "max": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        }
      }
    },
    "source_url": {
      "type": "string"
    },
    "tone": {
      "type": "string",
      "enum": [
        "corporate",
        "startup",
        "creative",
        "academic"
      ],
      "description": "Detected company culture tone"
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "ATS keywords extracted"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "applied",
        "interviewing",
        "rejected",
        "offer",
        "archived"
      ],
      "default": "active"
    },
    "applied_date": {
      "type": "string",
      "format": "date"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "company"
  ]
}